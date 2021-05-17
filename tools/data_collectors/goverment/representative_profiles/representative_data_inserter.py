from representative_normalizer import RepresentativeNormalizer
import sys
from psycopg2 import Error
import psycopg2
from datetime import datetime


def read_data():
    normalizer = RepresentativeNormalizer()
    if sys.argv == '-p':
        normalizer.crawl_data()
    elif sys.argv[1] == '-f':
        normalizer.get_data_from_file(sys.argv[2])
    else:
        print("Unknown option")
        exit(0)
    normalizer.normalize()
    return normalizer.data


def parse_date(raw_date, date_format='%d-%m-%Y'):
    return datetime.strptime(raw_date, date_format)


def get_db_connection():
    connection = psycopg2.connect(user="mcpixzcwkhrrio",
                                  password="9141440570eff0a8d538498b8a95a407ad364d9297712891184913c19192ee26",
                                  host="ec2-54-229-68-88.eu-west-1.compute.amazonaws.com",
                                  port="5432",
                                  database="d704bc62gosle7")
    return connection


def menage_data(data: list):
    genders: dict = read_genders()
    db_politicians = read_politicians()

    for datum in data:
        insert_politician(datum, genders, db_politicians)
        db_polls = read_polls()
        insert_polls(datum)


def read_genders():
    result = {}
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(f"SELECT id, name FROM gender")
        genders = cursor.fetchall()
        for gender in genders:
            result[gender[1]] = gender[0]
    except (Exception, Error) as error:
        print("Error while connecting to PostgreSQL", error)
    finally:
        cursor.close()
        connection.close()
        return result


def read_politicians():
    result = []
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(
            f"SELECT id, name, surname, profession, picture, education, birth_place, votes, birth_date, gender "
            f"FROM politicians")
        politicians = cursor.fetchall()
        for politician in politicians:
            result.append({
                'id': politician[0],
                'name': politician[1],
                'surname': politician[2],
                'profession': politician[3],
                'picture': politician[4],
                'education': politician[5],
                'birth_place': politician[6],
                'votes': politician[7],
                'birth_date': politician[8],
                'gender': politician[9]
            })
    except (Exception, Error) as error:
        print("Error while connecting to PostgreSQL", error)
    finally:
        cursor.close()
        connection.close()
        return result


def insert_politician(politician: dict, genders: dict, db_politicians):
    name = politician.get('Imię')
    surname = politician.get('Nazwisko')
    picture = politician.get('zdjęcie')
    dob = politician.get('Data urodzenia')
    pob = politician.get('Miejsce urodzenia')
    gender = politician.get('Płeć')
    profession = politician.get('Zawód')
    votes = politician.get('Liczba głosów')
    edu = politician.get('Wykształcenie')
    exists = False
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        for db_politician in db_politicians:
            if db_politician['name'] == name and db_politician['surname'] == surname:
                exists = True
                if db_politician['profession'] != profession:
                    try:
                        cursor.execute(
                            f"UPDATE politicians SET profession = '{profession}' WHERE id = {db_politician['id']}")
                    except (Exception, Error) as error:
                        print("Error while updating picture", error)
                        connection.rollback()
                    connection.commit()
                if not db_politician['picture']:
                    try:
                        cursor.execute(
                            f"UPDATE politicians SET picture = decode('{picture}', 'base64') "
                            f"WHERE id = {db_politician['id']}")
                    except (Exception, Error) as error:
                        print("Error while updating picture", error)
                        connection.rollback()
                    connection.commit()
                if db_politician['education'] != edu:
                    try:
                        cursor.execute(f"UPDATE politicians SET education = '{edu}' WHERE id = {db_politician['id']}")
                    except (Exception, Error) as error:
                        print("Error while updating education", error)
                        connection.rollback()
                    connection.commit()
                if db_politician['birth_place'] != pob:
                    try:
                        cursor.execute(f"UPDATE politicians SET birth_place = '{pob}' WHERE id = {db_politician['id']}")
                    except (Exception, Error) as error:
                        print("Error while updating birth_place", error)
                        connection.rollback()
                    connection.commit()
                if db_politician['votes'] != votes:
                    try:
                        cursor.execute(f"UPDATE politicians SET votes = '{votes}' WHERE id = {db_politician['id']}")
                    except (Exception, Error) as error:
                        print("Error while updating votes", error)
                        connection.rollback()
                    connection.commit()
                if db_politician['birth_date']:
                    try:
                        cursor.execute(
                            f"UPDATE politicians SET birth_date = '{parse_date(dob)}' WHERE id = {db_politician['id']}")
                    except (Exception, Error) as error:
                        print("Error while updating votes", error)
                        connection.rollback()
                    connection.commit()
                if db_politician['gender']:
                    g = genders[gender]
                    try:
                        cursor.execute(f"UPDATE politicians SET gender = '{g}' WHERE id = {db_politician['id']}")
                    except (Exception, Error) as error:
                        print("Error while updating votes", error)
                        connection.rollback()
                    connection.commit()
                politician['id'] = db_politician['id']
            if exists:
                break
        if not exists:
            print('it doesnt exist')
            g = genders[gender]
            try:
                cursor.execute(f"INSERT INTO politicians"
                               f"(name, surname, profession, picture, education, birth_place, votes, birth_date, gender) VALUES"
                               f"('{name}', '{surname}', '{profession}', decode('{picture.decode()}', 'base64'),"
                               f"'{edu}', '{pob}', '{votes}', '{parse_date(dob)}', '{g}')"
                               f"RETURNING id")
                politician['id'] = cursor.fetchone()[0]
            except (Exception, Error) as error:
                print("Error while inserting a politician", error)
                connection.rollback()
            connection.commit()
    except (Exception, Error) as error:
        print("Error while connecting to PostgreSQL", error)
    finally:
        cursor.close()
        connection.close()


def read_poll_topics():
    topics = []
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(f"SELECT * FROM poll_topics")
        for poll_topic in cursor.fetchall():
            topics.append({
                'id': poll_topic[0],
                'title': poll_topic[1],
            })
    except (Exception, Error) as error:
        print("Error while reading poll topics", error)
    finally:
        cursor.close()
        connection.close()
        return topics


def read_polls():
    polls = []
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(f"SELECT * FROM polls")
        for poll_topic in cursor.fetchall():
            polls.append({
                'id': poll_topic[0],
                'poll_topic': poll_topic[1],
                'politician': poll_topic[2],
                'vote': poll_topic[3],
                'time': poll_topic[4],
                'date': poll_topic[5]
            })
    except (Exception, Error) as error:
        print("Error while reading polls", error)
    finally:
        cursor.close()
        connection.close()
        return polls


def insert_polls(politician: dict):
    politician_id = politician.get('id')
    for poll in politician.get('głosowania'):
        db_topics = read_poll_topics()
        db_polls = read_polls()
        insert_poll(poll, db_topics, db_polls, politician_id)


def insert_poll(poll: dict, db_topics: list, db_polls: list, politician_id):
    date = poll.get('Data')
    votes = poll.get('głosy')
    for vote in votes:
        hour = vote.get('Godzina')
        source = vote.get('Wynik')
        topic = vote.get('Temat')
        topic_existence = False

        for db_topic in db_topics:
            if db_topic.get('title') == topic:
                topic_id = db_topic.get('id')
                topic_existence = True
                break
        try:
            connection = get_db_connection()
            cursor = connection.cursor()
            if not topic_existence:
                try:
                    cursor.execute(f"INSERT INTO poll_topics"
                                   f"(title) VALUES"
                                   f"('{topic}')"
                                   f"RETURNING id")
                    topic_id = cursor.fetchone()[0]
                except (Exception, Error) as error:
                    print("Error while inserting poll topics", error)
                    connection.rollback()
                connection.commit()

            # poll_existence = False
            # for db_poll in db_polls:
            #     if (topic == db_poll.get('poll_topic') and date == db_poll.get('date') and
            #             politician_id == db_poll.get('politician') and source == db_poll.get('vote')):
            #         poll_existence = True
            #         break
            # if not poll_existence:
            #     try:
            #         connection = get_db_connection()
            #         cursor = connection.cursor()
            #         cursor.execute(f"INSERT INTO polls"
            #                        f"(parliament_topic, politician, vote, time, date) VALUES"
            #                        f"('{topic_id}', '{politician_id}', '{source}', '{hour}','{parse_date(date)}')"
            #                        f"RETURNING id")
            #         poll_id = cursor.fetchone()[0]
            #         print(poll_id)
            #     except (Exception, Error) as error:
            #         print("Error while inserting poll topics", error)
            #     finally:
            #         cursor.close()
            #         connection.close()
        except (Exception, Error) as error:
            print("Error while connecting to PostgreSQL", error)
        finally:
            cursor.close()
            connection.close()



def menage_speeches():
    pass


data = read_data()
menage_data(data)

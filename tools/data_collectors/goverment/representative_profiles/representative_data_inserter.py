import datetime

from representative_normalizer import RepresentativeNormalizer
import sys
from psycopg2 import Error
import psycopg2


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


def get_db_connection():
    connection = psycopg2.connect(user="mcpixzcwkhrrio",
                                  password="9141440570eff0a8d538498b8a95a407ad364d9297712891184913c19192ee26",
                                  host="ec2-54-229-68-88.eu-west-1.compute.amazonaws.com",
                                  port="5432",
                                  database="d704bc62gosle7")
    return connection


def menage_data(data: list):
    genders = read_genders()
    db_politicians = read_politicians()

    for datum in data:
        insert_politician(datum, genders, db_politicians)


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
        cursor.execute(f"SELECT id, name, surname, profession, picture, education, birth_place, votes, birth_date, gender FROM politicians")
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
    if dob:
        dob = datetime.datetime.strptime(dob, '%d-%m-%Y')
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
            print(db_politician['name'] == name and db_politician['surname'] == surname)
            if db_politician['name'] == name and db_politician['surname'] == surname:
                print(name, surname)
                exists = True
        #         if not db_politician['profession']:
        #             try:
        #                 cursor.execute(f"UPDATE politicians SET profession = 'profession' WHERE id = {db_politician['id']}")
        #             except (Exception, Error) as error:
        #                 print("Error while updating picture", error)
        #                 connection.rollback()
        #             connection.commit()
        #         if not db_politician['picture']:
        #             try:
        #                 cursor.execute(f"UPDATE politicians SET picture = decode('{picture}', 'base64') WHERE id = {db_politician['id']}")
        #             except (Exception, Error) as error:
        #                 print("Error while updating picture", error)
        #                 connection.rollback()
        #             connection.commit()
        #         if not db_politician['education']:
        #             try:
        #                 cursor.execute(f"UPDATE politicians SET education = '{edu}' WHERE id = {db_politician['id']}")
        #             except (Exception, Error) as error:
        #                 print("Error while updating education", error)
        #                 connection.rollback()
        #             connection.commit()
        #         if not db_politician['birth_place']:
        #             try:
        #                 cursor.execute(f"UPDATE politicians SET birth_place = '{pob}' WHERE id = {db_politician['id']}")
        #             except (Exception, Error) as error:
        #                 print("Error while updating birth_place", error)
        #                 connection.rollback()
        #             connection.commit()
        #         if not db_politician['votes']:
        #             try:
        #                 cursor.execute(f"UPDATE politicians SET votes = '{votes}' WHERE id = {db_politician['id']}")
        #             except (Exception, Error) as error:
        #                 print("Error while updating votes", error)
        #                 connection.rollback()
        #             connection.commit()
        #         if not db_politician['birth_date']:
        #             try:
        #                 cursor.execute(f"UPDATE politicians SET birth_date = '{dob}' WHERE id = {db_politician['id']}")
        #             except (Exception, Error) as error:
        #                 print("Error while updating votes", error)
        #                 connection.rollback()
        #             connection.commit()
        #         if not db_politician['gender']:
        #             g = genders[gender]
        #             try:
        #                 cursor.execute(f"UPDATE politicians SET gender = '{g}' WHERE id = {db_politician['id']}")
        #             except (Exception, Error) as error:
        #                 print("Error while updating votes", error)
        #                 connection.rollback()
        #             connection.commit()
        if not exists:
            print('it doesnt exist')
            #
            # g = genders[gender]
            # try:
            #     print(f"INSERT INTO politicians"
            #                    f"(name, surname, profession, picture, education, birth_place, votes, birth_date, gender) VALUES"
            #                    f"('{name}', '{surname}', '{profession}', decode('{picture.decode()}', 'base64'),"
            #                    f"'{edu}', '{pob}', '{votes}', '{dob}', '{g}')")
                # cursor.execute(f"INSERT INTO politicians"
                #                f"(name, surname, profession, picture, education, birth_place, votes, birth_date, gender) VALUES"
                #                f"('{name}', '{surname}', '{profession}', decode('{picture.decode()}', 'base64'),"
                #                f"'{edu}', '{pob}', '{votes}', '{dob}', '{g}')")
            # except (Exception, Error) as error:
            #     print("Error while updating votes", error)
            #     connection.rollback()
            # connection.commit()
    except (Exception, Error) as error:
        print("Error while connecting to PostgreSQL", error)
    finally:
        cursor.close()
        connection.close()


data = read_data()
menage_data(data)
# imie = 'Wojtek'
# n = {}
# a = n.get('as')
# print(f"{imie or 'sex'} {a or 'aaa'}")
from representative_normalizer import RepresentativeNormalizer
import sys
from psycopg2 import Error
import psycopg2
from datetime import datetime, date

gender_columns = ('id', 'name')
politician_columns = ('id', 'name', 'surname', 'profession', 'picture', 'education', 'birth_place', 'votes',
                      'birth_date', 'gender')

poll_topic_columns = ('id', 'title')
poll_columns = ('id', 'parliament_topic', 'politician', 'vote', 'time', 'date')

speech_point_columns = ('id', 'name')
speech_columns = ('id', 'politician', 'speech', 'points', 'date')


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


def read_tb(table: str, output_columns: tuple, where: dict = None):
    output = []
    query = f"SELECT {', '.join(output_columns)} FROM {table}"
    if where:
        query += f" WHERE " + " and ".join(f"{key} = '{value}'" for key, value in where.items())
    try:
        cursor.execute(query)
    except (Exception, Error) as error:
        print(f"Error while reading table: {table}.", error)
    rows = cursor.fetchall()
    for row in rows:
        d = {}
        for i, cell in enumerate(row):
            d[output_columns[i]] = cell
        output.append(d)
    return output


def update_tb(table: str, cells: dict, id_):
    query = f"UPDATE {table} SET " + f", ".join(
        key + f" = '{value}'" if key != "picture" else f"{key} = {value}" for key, value in
        cells.items()) + f"WHERE id = '{id_}'"
    try:
        cursor.execute(query)
    except (Exception, Error) as error:
        print(f"Error while updating table: {table}.", error)
        connection.rollback()
    connection.commit()


def menage_data(data: list):
    genders: dict = {info.get('name'): info.get('id') for info in read_tb('gender', gender_columns)}

    for datum in data:
        menage_politicians(datum, genders)
        menage_polls(datum)
        menage_speeches(datum)


def parse_date(raw_date, date_format='%d-%m-%Y'):
    return datetime.strptime(raw_date, date_format).date()


def menage_politicians(politician: dict, genders: dict):
    tb_name = 'politicians'
    db_politician = read_tb(tb_name, politician_columns, {
        politician_columns[1]: politician.get('Imię'),
        politician_columns[2]: politician.get('Nazwisko')
    })
    if len(db_politician) > 1:
        print("More than one politicians are the Database with the same name. It requires manual actions.")
        print(f"Database politicians: {db_politician}")
        print(f"Requested  politician: {politician}")

    elif db_politician:
        db_politician = db_politician[0]
        update_politician(politician, db_politician, genders, tb_name)
    else:
        insert_politician(politician, genders)


def update_politician(politician: dict, db_politician: dict, genders: dict, tb_name: str):
    cells: dict = dict()

    if politician.get('Zawód') != db_politician.get(politician_columns[3]):
        cells[politician_columns[3]] = politician.get('Zawód')

    if not db_politician.get(politician_columns[4]) and politician.get('zdjęcie'):
        cells[politician_columns[4]] = f"decode('{politician.get('zdjęcie')}', 'base64')"

    if politician.get('Wykształcenie') != db_politician.get('education'):
        cells[politician_columns[5]] = politician.get('Wykształcenie')

    if politician.get('Miejsce urodzenia') != db_politician.get('birth_place'):
        cells[politician_columns[6]] = politician.get('Miejsce urodzenia')

    if politician.get('Liczba głosów') != str(db_politician.get('votes')):
        cells[politician_columns[7]] = politician.get('Liczba głosów')

    if parse_date(politician.get('Data urodzenia')) != db_politician.get('birth_date'):
        cells[politician_columns[8]] = parse_date(politician.get('Data urodzenia'))

    if genders.get(politician.get('Płeć')) != db_politician.get('gender'):
        cells[politician_columns[9]] = genders.get(politician.get('Płeć'))

    politician['id'] = db_politician.get('id')

    if cells:
        update_tb(tb_name, cells, politician['id'])


def insert_politician(politician: dict, genders: dict):
    query = f"INSERT INTO politicians ( " + ", ".join(column for column in politician_columns[1:]) + f"""
        ) VALUES ('{politician.get('Imię')}', '{politician.get('Nazwisko')}', '{politician.get('Zawód')}',
         decode('{politician.get('zdjęcie')}', 'base64'), '{politician.get('Wykształcenie')}', 
         '{politician.get('Miejsce urodzenia')}', '{politician.get('Liczba głosów')}',
         '{parse_date(politician.get('Data urodzenia'))}', '{genders.get(politician.get('Płeć'))}') RETURNING id"""
    try:
        cursor.execute(query)
        politician['id'] = cursor.fetchone()[0]
    except (Exception, Error) as error:
        print(f"Error while inserting a politician: {politician}", error)
        connection.rollback()
    connection.commit()


def menage_polls(politician: dict):
    insert_votes = list()

    polls = politician.get('głosowania')
    if polls:
        for poll in polls:
            poll_date = parse_date(poll.get('Data'))
            votes = poll.get('głosy')
            if votes:
                for vote in votes:
                    topic = vote.get('Temat')
                    poll_topic = dict()
                    poll_topic[poll_topic_columns[1]] = topic
                    db_topics = read_tb('poll_topics', poll_topic_columns, poll_topic)
                    if len(db_topics) == 0:
                        query = f"INSERT INTO poll_topics ({poll_topic_columns[1]}) VALUES ('{topic}') RETURNING id"
                        try:
                            cursor.execute(query)
                            vote['id'] = cursor.fetchone()[0]
                        except (Exception, Error) as error:
                            print("Error while inserting poll_topics", error)
                            print(query)
                            connection.rollback()
                        connection.commit()

                    elif len(db_topics) == 1:
                        vote['id'] = db_topics[0].get('id')

                    vote_dict = {
                        poll_columns[1]: vote.get('id'),
                        poll_columns[2]: politician.get('id'),
                        poll_columns[3]: vote.get('Wynik'),
                        poll_columns[4]: vote.get('Godzina'),
                        poll_columns[5]: str(poll_date)
                    }
                    insert_votes.append(
                        "(" + ", ".join(f"'{v}'" for v in vote_dict.values()) + ")")

            if insert_votes:
                query = f"INSERT INTO polls ({', '.join(poll_columns[1:])}) VALUES " + ", ".join(insert_votes) +\
                        f" ON CONFLICT ({', '.join(poll_columns[1:])}) DO NOTHING"
                try:
                    cursor.execute(query)
                except (Exception, Error) as error:
                    print("Error while inserting to polls", error)
                    connection.rollback()
                connection.commit()


def menage_speeches(politician: dict):
    insert_speeches = list()

    speeches = politician.get('Wypowiedzi')
    if speeches:
        for speech in speeches:
            db_points = read_tb('speech_points', speech_point_columns, {'name': speech.get('Punkty')})

            if db_points:
                speech['point_id'] = db_points[0]['id']
            else:
                query = f"INSERT INTO speech_points ({speech_point_columns[1]}) VALUES ('{speech.get('Punkty')}') " \
                        f"RETURNING id"
                try:
                    cursor.execute(query)
                    speech['point_id'] = cursor.fetchone()[0]
                except (Exception, Error) as error:
                    print("Error while inserting speech_points", error)
                    connection.rollback()
                connection.commit()

            speech_dict = {
                speech_columns[1]: politician.get('id'),
                speech_columns[2]: speech.get('tekst'),
                speech_columns[3]: speech.get('point_id'),
                speech_columns[4]: str(parse_date(speech.get('Data')))
            }
            db_speech = read_tb('parliament_speeches', speech_columns, speech_dict)
            if not db_speech:
                insert_speeches.append("(" + ", ".join(f"'{v}'" for v in speech_dict.values()) + ")")

        if insert_speeches:
            query = f"INSERT INTO parliament_speeches ({', '.join(speech_columns[1:])}) VALUES " + ", ".join(
                insert_speeches)
            try:
                cursor.execute(query)
            except (Exception, Error) as error:
                print("Error while inserting to parliament_speeches", error)
                connection.rollback()
            connection.commit()


data = read_data()
try:
    connection = get_db_connection()
    cursor = connection.cursor()
    menage_data(data)
except (Exception, Error) as error:
    print("Error while connecting to PostgreSQL", error)
finally:
    cursor.close()
    connection.close()

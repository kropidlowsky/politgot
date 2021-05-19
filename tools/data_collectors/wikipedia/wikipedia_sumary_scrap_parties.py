# -*- coding: utf-8 -*-
import wikipedia
from urllib.parse import unquote
from psycopg2 import Error
import psycopg2
import xlrd


def get_db_connection():
    connection = psycopg2.connect(user="mcpixzcwkhrrio",
                                  password="9141440570eff0a8d538498b8a95a407ad364d9297712891184913c19192ee26",
                                  host="ec2-54-229-68-88.eu-west-1.compute.amazonaws.com",
                                  port="5432",
                                  database="d704bc62gosle7")
    return connection


def get_wiki_from_file():
    wiki_records = {}
    book = xlrd.open_workbook('../twitter/partie.xls')
    sh = book.sheet_by_index(0)
    for rx in range(sh.nrows):
        if rx == 0:
            continue
        wiki_records[sh.cell_value(rx, 0)] = \
            unquote(sh.cell_value(rx, 3).replace('https://pl.wikipedia.org/wiki/', '')).replace('_', ' ')
    return wiki_records


def get_wiki_from_db():
    cursor = get_db_connection().cursor()
    cursor.execute(
        f"""
        SELECT id, url
        FROM political_parties_wiki;""")
    wiki_records = cursor.fetchall()
    result = {}
    for record in wiki_records:
        result[record[0]] = record[1]
    return result


def download_wiki_summary(production):
    wiki_counter = 0
    try:
        wikipedia.set_lang('pl')
        error_list = []
        connection = get_db_connection()
        cursor = connection.cursor()
        if not production:
            resources = get_wiki_from_file()
        else:
            resources = get_wiki_from_db()

        for name, wiki_name in resources.items():
            if not production and wiki_name == '-':
                continue
            summary = wikipedia.summary(wiki_name).replace('"', ' ').replace("'", ' ')
            if not production:
                cursor.execute(
                    f"""
                    SELECT political_parties.id, pw.summary
                    FROM political_parties
                    LEFT JOIN political_parties_wiki pw on political_parties.id = pw.political_party
                    WHERE name='{name}';""")
                wiki_record = cursor.fetchone()
                if wiki_record and not wiki_record[1]:
                    cursor.execute(
                        f"INSERT INTO political_parties_wiki (url, political_party, summary) VALUES('{wiki_name}','{wiki_record[0]}', '{summary}');")
                    connection.commit()
                elif wiki_record and wiki_record[1]:
                    cursor.execute(
                        f"UPDATE political_parties_wiki SET summary = '{summary}' WHERE id = {wiki_record[0]};")
                    connection.commit()
            else:
                cursor.execute(f"UPDATE political_parties_wiki SET summary = '{summary}' WHERE id = {name};")
                connection.commit()

            wiki_counter += 1
            print(name, wiki_counter)


    except (Exception, Error) as error:
        print("Error while connecting to PostgreSQL", error)
    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")
            for error in error_list:
                print('Błąd dla: ', error)


download_wiki_summary(production=True)

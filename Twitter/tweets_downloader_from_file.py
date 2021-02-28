from requests_oauthlib import OAuth1Session
from time import strptime
from datetime import datetime
from psycopg2 import Error
import psycopg2
import xlrd



def get_politicians_from_file():
    """
    :return: dictionary with politicians name: twitter_name
    """
    politicians = {}
    book = xlrd.open_workbook('politycy.xls')
    sh = book.sheet_by_index(0)
    for rx in range(sh.nrows):
        if rx == 0:
            continue
        politicians[sh.cell_value(rx, 0)] = sh.cell_value(rx, 1)
    return politicians

consumer_key = ''  # Add your API key here
consumer_secret = ''  # Add your API secret key here
access_token = ''
access_token_secret = ''
oauth = OAuth1Session(consumer_key,
                       client_secret=consumer_secret,
                       resource_owner_key=access_token,
                       resource_owner_secret=access_token_secret)
request_counter = 0
politic_counter = 0
try:
    error_list = []
    connection = psycopg2.connect(user="pz2020nsi1",
                                  password="",
                                  host="",
                                  port="55655",
                                  database="")
    cursor = connection.cursor()
    for name, tweet_polit_name in get_politicians_from_file().items():
        politic_counter += 1
        print(name, politic_counter)
        #----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        # cursor.execute(
        #     f"SELECT id,name,surname FROM politicians WHERE name='{name.split()[1]}' AND surname ='{name.split()[0]}'")
        # politic_database_profile = cursor.fetchone()
        # if not politic_database_profile:
        #     cursor.execute(f"INSERT INTO politicians (name, surname) VALUES('{name.split()[1]}','{name.split()[0]}');")
        #     connection.commit()
        # ----------------------------------------------------------------------------------------------------------------------------------------------------------------------

        cursor.execute(f"SELECT id, username FROM politicians_twitter_accounts WHERE username='{tweet_polit_name}'")
        politic_twitter_account = cursor.fetchone()
        if not politic_twitter_account:
            cursor.execute(f"SELECT id,name,surname FROM politicians WHERE name='{name.split()[1]}' AND surname ='{name.split()[0]}'")
            politic_database_profile = cursor.fetchone()
            if not politic_database_profile:
                cursor.execute( f"INSERT INTO politicians (name, surname) VALUES('{name.split()[1]}','{name.split()[0]}');")
                connection.commit()
                cursor.execute(
                    f"SELECT id,name,surname FROM politicians WHERE name='{name.split()[1]}' AND surname = '{name.split()[0]}'")
                politic_database_profile = cursor.fetchone()[0]
                cursor.execute(f"INSERT INTO politicians_twitter_accounts (username, politician) VALUES('{tweet_polit_name}','{politic_database_profile}');")
                connection.commit()
            else:
                cursor.execute(
                    f"INSERT INTO politicians_twitter_accounts (username, politician) VALUES('{tweet_polit_name}','{politic_database_profile[0]}');")
                connection.commit()
            cursor.execute(f"SELECT id, username FROM politicians_twitter_accounts WHERE username='{tweet_polit_name}'")
            politic_twitter_account = cursor.fetchone()


        if tweet_polit_name == '-':
            continue
        since_id = 664211632491393024  # id od 10 listopada 2015
        max_id = 1577509021793124359
        cursor.execute(f'SELECT id, "user" FROM politicians_tweets WHERE "user" = {int(politic_twitter_account[0])}')
        politic_tweets = cursor.fetchall()
        if politic_tweets:
            max_id = int(politic_tweets[0][0])
            for tweet_item in politic_tweets:
                if int(tweet_item[0]) < max_id:
                    max_id = int(tweet_item[0])
            max_id -= 1

        while True:
            request_counter += 1
            print('Collecting data...', request_counter)
            response = oauth.get(f"https://api.twitter.com/1.1/statuses/user_timeline.json?id={tweet_polit_name}&"
                                 f"tweet_mode=extended&exclude_replies=true&include_rts=false&count=200&max_id={max_id}&since_id={since_id}")
            if not response.json() or response.status_code != 200:
                print(response.status_code, response.content)
                break
            if response.json()[0]['id'] < since_id:
                break
            for tweet in response.json():
                str_id = tweet['id_str']
                id = tweet['id']
                full_text = tweet['full_text']
                photo_url = ''
                video_url = ''
                if 'http://t' in full_text[-23:]:
                    looking_index = full_text.find('http://t', len(full_text) - 25)
                    url_to_tweet = full_text[looking_index:]
                    full_text = full_text[:looking_index]
                elif 'https://t' in full_text[-23:]:
                    looking_index = full_text.find('https://t', len(full_text) - 25)
                    url_to_tweet = full_text[looking_index:]
                    full_text = full_text[:looking_index]
                else:
                    url_to_tweet = f'https://twitter.com/{tweet["user"]["screen_name"]}/status/{str_id}'
                create_date_string = tweet['created_at'].split()
                to_datetime_string = f'{create_date_string[5]}-{strptime(f"{create_date_string[1]}", "%b").tm_mon}-{create_date_string[2]} {create_date_string[3]}'
                create_date = datetime.strptime(to_datetime_string, '%Y-%m-%d %H:%M:%S')

                if tweet.get('entities') and tweet['entities'].get('media'):
                    if tweet['entities']['media'][0].get('media_url'):
                        if tweet['entities']['media'][0]['type'] == 'photo':
                            photo_url = tweet['entities']['media'][0].get('media_url')
                        elif tweet['entities']['media'][0]['type'] == 'video':
                            video_url = tweet['entities']['media'][0].get('media_url')
                if tweet.get('extended_entities') and tweet['extended_entities'].get('media'):
                    if tweet['extended_entities']['media'][0].get('media_url'):
                        if tweet['extended_entities']['media'][0]['type'] == 'video':
                            for variant in tweet['extended_entities']['media'][0]['video_info']['variants']:
                                if variant['content_type'] == 'video/mp4':
                                    video_url = variant['url']
                max_id = id - 1
                #insert tweeta do bazy
                try:
                    cursor.execute(
                        f'INSERT INTO politicians_tweets (id, "user", message, date, url_photo, url_video, url_tweet) '
                        f"VALUES('{str_id}',{int(politic_twitter_account[0])},'{full_text}','{create_date}','{photo_url}', '{video_url}', '{url_to_tweet}');")
                    connection.commit()
                except Exception as err:
                    connection.rollback()
                    try:
                        cursor.execute(
                            f'''INSERT INTO politicians_tweets (id, "user", message, date, url_photo, url_video, url_tweet)
VALUES('{str_id}',{int(politic_twitter_account[0])},"{full_text}","{create_date}",'{photo_url}', '{video_url}', '{url_to_tweet}');''')
                        connection.commit()

                    except Exception as errr:
                        connection.rollback()
                        print(errr)
                    error_list.append((tweet['id'], tweet_polit_name, err))
                    continue


except (Exception, Error) as error:
    print("Error while connecting to PostgreSQL", error)
finally:
    if (connection):
        cursor.close()
        connection.close()
        print("PostgreSQL connection is closed")
        for error in error_list:
            print('Błąd dla: ', error)

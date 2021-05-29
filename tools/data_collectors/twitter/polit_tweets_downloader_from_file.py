from requests_oauthlib import OAuth1Session
from time import strptime
from datetime import datetime
from psycopg2 import Error
import psycopg2
import xlrd


def fix_message(message, url_tweet):
    if len(message) == 22 and len(url_tweet) == 1 and message[0:13] == 'https://t.co/':
        fixed_url = message + url_tweet
        fixed_message = f'Pełna treść posta dostępna pod adresem: {fixed_url}'
        return fixed_message, fixed_url
    return message, url_tweet


def get_db_connection():
    connection = psycopg2.connect(user="mcpixzcwkhrrio",
                                  password="9141440570eff0a8d538498b8a95a407ad364d9297712891184913c19192ee26",
                                  host="ec2-54-229-68-88.eu-west-1.compute.amazonaws.com",
                                  port="5432",
                                  database="d704bc62gosle7")
    return connection

def get_politicians_from_file():
    """
    :return: dictionary with politicians name: twitter_name
    """
    politicians = {}
    book = xlrd.open_workbook('partie.xls')
    sh = book.sheet_by_index(0)
    for rx in range(sh.nrows):
        if rx == 0:
            continue
        politicians[sh.cell_value(rx, 0)] = [sh.cell_value(rx, 1), sh.cell_value(rx, 2)]
    return politicians

def get_parties_from_db():
    cursor = get_db_connection().cursor()
    cursor.execute(f"SELECT id, username FROM political_parties_twitter_accounts ")
    parties = cursor.fetchall()
    result = {}
    for party in parties:
        result[party[1]] = party[0]
    return result


consumer_key = 'v6XMtU00ZX5maLDTqgpojsLCl'  # Add your API key here
consumer_secret = 'cCQleIhMpQAZRVAhrlmst9k9DFW6mXacH6gaVXYhtm9Tc1cTdh'  # Add your API secret key here
access_token = "1270048556997586945-qmyRx3ICBV9NhWJ1xLk42cEvJtBvnf"
access_token_secret = "tUjc0cFltvMVrNGldJHgqnQrtC4z7u1LOH1UnsfXVk3od"
oauth = OAuth1Session(consumer_key,
                       client_secret=consumer_secret,
                       resource_owner_key=access_token,
                       resource_owner_secret=access_token_secret)

def download_tweets(production):
    request_counter = 0
    politic_counter = 0
    try:
        error_list = []
        connection = get_db_connection()
        cursor = connection.cursor()
        if not production:
            resources = get_politicians_from_file()
        else:
            resources = get_parties_from_db()

        for name, tweet_party_name in resources.items():
            short_name = tweet_party_name[0] if isinstance(tweet_party_name, list) else ''
            twitter_name = tweet_party_name[1].strip() if isinstance(tweet_party_name, list) else tweet_party_name
            politic_counter += 1
            print(name, politic_counter)
            if not production:
                if tweet_party_name == '-':
                    continue
                # ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
                # Download new parties from file
                # cursor.execute(
                #     f"SELECT id,name,abbr FROM political_parties WHERE name='{name}'")
                # party_database_profile = cursor.fetchone()
                # if not party_database_profile:
                #     cursor.execute(f"INSERT INTO political_parties (name, abbr) VALUES('{name}','{short_name}');")
                #     connection.commit()
                # ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
                print(twitter_name)
                cursor.execute(f"SELECT id, username FROM political_parties_twitter_accounts WHERE username='{twitter_name}'")
                politic_twitter_account = cursor.fetchone()
                print(politic_twitter_account)
                if not politic_twitter_account:
                    cursor.execute(f"SELECT id,name FROM political_parties WHERE name='{name}'")
                    party_database_profile = cursor.fetchone()
                    cursor.execute(
                        f"INSERT INTO political_parties_twitter_accounts (username, political_party) VALUES('{twitter_name}','{party_database_profile[0]}');")
                    connection.commit()
                    cursor.execute(f"SELECT id, username FROM political_parties_twitter_accounts WHERE username='{twitter_name}'")
                    politic_twitter_account = cursor.fetchone()
            else:
                politic_twitter_account = [twitter_name]
                twitter_name = name

            cursor.execute(
                f'SELECT id, "user" FROM political_parties_tweets WHERE "user" = {int(politic_twitter_account[0])}')
            politic_tweets = cursor.fetchall()

            since_id = 664211632491393024  # id od 10 listopada 2015
            max_id = 1977509021793124359


            if politic_tweets and not production:
                max_id = int(politic_tweets[0][0])
                for tweet_item in politic_tweets:
                    if int(tweet_item[0]) < max_id:
                        max_id = int(tweet_item[0])
                max_id -= 1
            if politic_tweets and production:
                since_id = int(politic_tweets[0][0])
                for tweet_item in politic_tweets:
                    if int(tweet_item[0]) > since_id:
                        since_id = int(tweet_item[0])
                since_id -= 1


            while True:
                request_counter += 1
                print('Collecting data...', request_counter)
                response = oauth.get(f"https://api.twitter.com/1.1/statuses/user_timeline.json?id={twitter_name}&"
                                     f"tweet_mode=extended&exclude_replies=true&include_rts=false&count=200&max_id={max_id}&since_id={since_id}")
                if not response.json() or response.status_code != 200:
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
                    full_text = full_text.replace("'", '')
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
                    full_text, url_to_tweet = fix_message(full_text, url_to_tweet)
                    try:
                        cursor.execute(
                            f'INSERT INTO political_parties_tweets (id, "user", message, date, url_photo, url_video, url_tweet) '
                            f"VALUES('{str_id}',{int(politic_twitter_account[0])},'{full_text}','{create_date}','{photo_url}', '{video_url}', '{url_to_tweet}');")
                        connection.commit()
                    except Exception as err:
                        connection.rollback()
                        try:
                            cursor.execute(
                                f'''INSERT INTO political_parties_tweets (id, "user", message, date, url_photo, url_video, url_tweet)
                        VALUES('{str_id}',{int(politic_twitter_account[0])},"{full_text}","{create_date}",'{photo_url}', '{video_url}', '{url_to_tweet}');''')
                            connection.commit()

                        except Exception as errr:
                            connection.rollback()
                            print(errr)
                        error_list.append((tweet['id'], twitter_name, err))
                        continue


    except (Exception, Error) as error:
        print("Error while connecting to PostgreSQL", error)
    finally:
        if (connection):
            cursor.execute("update political_parties_tweets set finder = to_tsvector(message);")
            cursor.execute("update parliament_speeches set finder = to_tsvector(speech);")
            connection.commit()
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")
            for error in error_list:
                print('Błąd dla: ', error)


download_tweets(production=True)

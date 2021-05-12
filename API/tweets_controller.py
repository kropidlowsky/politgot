from functools import wraps
from flask import Flask, jsonify, request, make_response
from psycopg2 import Error
from datetime import datetime
from flasgger import Swagger

import hashlib
import psycopg2


HEADERS = {'Access-Control-Allow-Origin': '*',
           'Access-Control-Allow-Credentials': True,
           'Access-Control-Allow-Method': 'GET',
           'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept'
           }

app = Flask(__name__)
app.config['SWAGGER'] = {
    'title': 'Politgot API',
    'uiversion': 2,
    'info': 'API',
}
DEFAULT_CONFIG = {
    "headers": [
    ],
    "specs": [
        {
            "endpoint": 'apispec_1',
            "route": '/apispec_1.json',
            "rule_filter": lambda rule: True,  # all in
            "model_filter": lambda tag: True,  # all in
        }
    ],
    "static_url_path": "/flasgger_static",
    # "static_folder": "static",  # must be set by user
    "swagger_ui": True,
    "specs_route": "/"
}
template = {
    "swagger": "2.0",
    # 'tags': [{'name': 'tweets', 'description': ''}],
    "info": {
        "description": "Team project of Nicolaus Copernicus University students",
        "version": "0.0.1"
    },
    # "basePath": "http://localhost:5000/",  # base bash for blueprint registration
    "schemes": [
        "http",
        "https"
    ],
    'securityDefinitions': {
        'basicAuth': {
            'type': 'basic'
        }
    }
}
swagger = Swagger(app, template=template, config=DEFAULT_CONFIG)


def get_connection_database():
    try:
        connection = psycopg2.connect(user="mcpixzcwkhrrio",
                                      password="9141440570eff0a8d538498b8a95a407ad364d9297712891184913c19192ee26",
                                      host="ec2-54-229-68-88.eu-west-1.compute.amazonaws.com",
                                      port="5432",
                                      database="d704bc62gosle7")

    except (Exception, Error) as error:
        return {'error': error}
    finally:
        return {'connection': connection}


def check_auth(username, password):
    connection = get_connection_database()
    if connection.get('error'):
        response = make_response({'error': 'Error during connection'}, 500, HEADERS)
        return response
    connection = connection['connection']
    cursor = connection.cursor()
    username = hashlib.md5(username.encode()).hexdigest()
    password = hashlib.md5(password.encode()).hexdigest()
    cursor.execute(f"SELECT COUNT(*) "
                   f"FROM api_user "
                   f"WHERE username_mdhex = '{username}' AND password_mdhex = '{password}';")
    result = cursor.fetchone()
    if result:
        return True
    return False


def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if not auth or not check_auth(auth.username, auth.password):
            message = {'error': 'Basic Auth Required.'}
            resp = jsonify(message)
            resp.status_code = 401
            return resp
        return f(*args, **kwargs)

    return decorated


# @app.route('/tweets', methods=['GET'])
# @requires_auth
@app.route('/tweets', methods=['GET'])
def get_politic_tweets():
    """Endpoint return a list of tweets by given politic name
        ---
        tags:
          - Twitter
        parameters:
          - name: politic
            in: query
            type: string
            required: true
            description: Politic name in format - name_surname
          - name: date_to
            in: query
            type: string
            format: date
            example: 2020-01-01
            required: false
            description: Filter tweets to date in format - YYYY-MM-DD
          - name: date_from
            in: query
            type: string
            format: date
            example: 2018-01-01
            required: false
            description: Filter tweets from date in format - YYYY-MM-DD


        responses:
          200:
            description: A list of tweets (may be filtered by date)
          400:
            description: Bad parameter
          500:
            description: Error during connection
        """
    politic = request.args.get('politic', False)
    date_from = request.args.get('date_from', False)
    date_to = request.args.get('date_to', False)
    if not politic:
        response = make_response({'error': 'Bad parameter'}, 400, HEADERS)
        return response
    try:
        politic = politic.strip()
        politic = politic.replace('"', '').replace("'", '')
        politic_name, politic_surname = politic.split('_')
        politic_name = politic_name.capitalize()
        politic_surname = politic_surname.capitalize()
        if '-' in politic_surname:
            index = politic_surname.index('-')
            politic_surname = politic_surname[:index] + '-' + politic_surname[index + 1:].capitalize()
        if not politic_name or not politic_surname:
            raise
    except:
        response = make_response({'error': 'Bad parameter'}, 400, HEADERS)
        return response

    connection = get_connection_database()
    if connection.get('error'):
        response = make_response({'error': 'Error during connection'}, 500, HEADERS)
        return response
    connection = connection['connection']
    cursor = connection.cursor()
    cursor.execute(f"SELECT politicians_twitter_accounts.id, name, surname "
                   f"FROM politicians "
                   f"LEFT JOIN politicians_twitter_accounts "
                   f"ON politicians_twitter_accounts.politician = politicians.id "
                   f"WHERE name ilike '{politic_name}' AND surname ilike '{politic_surname}';")
    result = cursor.fetchone()
    if not result or not result[0]:
        response = make_response({'error': 'No politic found or no twitter account found'}, 200, HEADERS)
        return response
    query = f"SELECT message, date, tags, url_photo, url_video, url_tweet FROM politicians_tweets " \
            f'WHERE "user" = {int(result[0])}'
    if date_to:
        try:
            date_to = datetime.strptime(date_to, '%Y-%m-%d')
            query += f" AND date <= '{date_to.strftime('%Y-%m-%d')}' "
        except:
            response = make_response({'error': 'Bad parameter'}, 400, HEADERS)
            return response
    if date_from:
        try:
            date_from = datetime.strptime(date_from, '%Y-%m-%d')
            query += f" AND date >= '{date_from.strftime('%Y-%m-%d')}' "
        except:
            response = make_response({'error': 'Bad parameter'}, 400, HEADERS)
            return response

    query += ' ORDER BY date DESC'
    cursor.execute(query + ';')
    result = cursor.fetchall()
    response = []
    for row in result:
        response.append({'message': row[0],
                         'date': row[1],
                         'tags': row[2],
                         'url_photo': row[3],
                         'url_video': row[4],
                         'url_tweet': row[5],
                         'name': politic_name,
                         'surname': politic_surname,
                         })

    query = f"SELECT id, qty, word FROM find_statistics" \
            f" WHERE word = '{politic_name.capitalize() + ' '+  politic_surname.capitalize()}' LIMIT 1"
    cursor.execute(query + ';')
    result = cursor.fetchone()
    if result:
        cursor.execute(
            f'UPDATE find_statistics SET qty = {result[1] + 1} WHERE id = {result[0]};')
        connection.commit()
    else:
        cursor.execute(
            f'INSERT INTO find_statistics (qty, word, is_politic_search) '
            f"VALUES(1, '{politic_name.capitalize() + ' '+  politic_surname.capitalize()}', True);")
        connection.commit()

    cursor.close()
    connection.close()
    response = make_response({'result': response}, 200, HEADERS)
    return response


# @app.route('/parties_tweets', methods=['GET'])
# @requires_auth
@app.route('/parties_tweets', methods=['GET'])
def get_politic_party_tweets():
    """Endpoint return a list of tweets by given politic name
        ---
        tags:
          - Twitter
        parameters:
          - name: politic_party
            in: query
            type: string
            required: true
            description: Politic party name in format - xxx_yyy_zzz
          - name: date_to
            in: query
            type: string
            format: date
            example: 2020-01-01
            required: false
            description: Filter tweets to date in format - YYYY-MM-DD
          - name: date_from
            in: query
            type: string
            format: date
            example: 2018-01-01
            required: false
            description: Filter tweets from date in format - YYYY-MM-DD


        responses:
          200:
            description: A list of tweets (may be filtered by date)
          400:
            description: Bad parameter
          500:
            description: Error during connection
        """
    politic_party = request.args.get('politic_party', False)
    date_from = request.args.get('date_from', False)
    date_to = request.args.get('date_to', False)
    if not politic_party:
        response = make_response({'error': 'Bad parameter'}, 400, HEADERS)
        return response
    try:
        if politic_party:
            politic_party = politic_party.strip()
            politic_party = politic_party.replace('"', '').replace("'", '')
            politic_party = ' '.join(politic_party.split('_')) if len(politic_party.split('_')) > 1 else politic_party
            politic_party = politic_party.capitalize()
    except:
        response = make_response({'error': 'Bad parameter'}, 400, HEADERS)
        return response

    connection = get_connection_database()
    if connection.get('error'):
        response = make_response({'error': 'Error during connection'}, 500, HEADERS)
        return response
    connection = connection['connection']
    cursor = connection.cursor()
    cursor.execute(f"SELECT political_parties_twitter_accounts.id "
                   f"FROM political_parties "
                   f"LEFT JOIN political_parties_twitter_accounts "
                   f"ON political_parties_twitter_accounts.political_party = political_parties.id "
                   f"WHERE name ilike  '{politic_party}';")
    result = cursor.fetchone()
    if not result or not result[0]:
        response = make_response({'error': 'No politic party found or no twitter account found'}, 200, HEADERS)
        return response
    query = f"SELECT message, date, tags, url_photo, url_video, url_tweet FROM political_parties_tweets " \
            f'WHERE "user" = {int(result[0])}'
    if date_to:
        try:
            date_to = datetime.strptime(date_to, '%Y-%m-%d')
            query += f" AND date <= '{date_to.strftime('%Y-%m-%d')}' "
        except:
            response = make_response({'error': 'Bad parameter'}, 400, HEADERS)
            return response
    if date_from:
        try:
            date_from = datetime.strptime(date_from, '%Y-%m-%d')
            query += f" AND date >= '{date_from.strftime('%Y-%m-%d')}' "
        except:
            response = make_response({'error': 'Bad parameter'}, 400, HEADERS)
            return response

    query += ' ORDER BY date DESC'
    cursor.execute(query + ';')
    result = cursor.fetchall()
    response = []
    for row in result:
        response.append({'message': row[0],
                         'date': row[1],
                         'tags': row[2],
                         'url_photo': row[3],
                         'url_video': row[4],
                         'url_tweet': row[5],
                         'name': politic_party
                         })

    query = f"SELECT id, qty, word FROM find_statistics" \
            f" WHERE word = '{politic_party}' LIMIT 1"
    cursor.execute(query + ';')
    result = cursor.fetchone()
    if result:
        cursor.execute(
            f'UPDATE find_statistics SET qty = {result[1] + 1} WHERE id = {result[0]};')
        connection.commit()
    else:
        cursor.execute(
            f'INSERT INTO find_statistics (qty, word, is_politic_party_search) '
            f"VALUES(1, '{politic_party}', True);")
        connection.commit()

    cursor.close()
    connection.close()
    response = make_response({'result': response}, 200, HEADERS)
    return response


# @app.route('/polit', methods=['GET'])
# @requires_auth
@app.route('/polit', methods=['GET'])
def get_politicians():
    """Endpoint return a list of politicians in database
        ---
        tags:
          - Twitter
        responses:
          200:
            description: A list of politicians
          500:
            description: Error during connection
        """
    connection = get_connection_database()
    if connection.get('error'):
        response = make_response({'error': 'Error during connection'}, 500, HEADERS)
        return response
    connection = connection['connection']
    cursor = connection.cursor()
    cursor.execute(f"SELECT name, surname "
                   f"FROM politicians ORDER BY surname;")
    result = cursor.fetchall()
    response = []
    for row in result:
        response.append({'name': row[0],
                         'surname': row[1],
                         })
    cursor.close()
    connection.close()
    response = make_response({'result': response}, 200, HEADERS)
    return response

# @app.route('/parties', methods=['GET'])
# @requires_auth
@app.route('/parties', methods=['GET'])
def get_parties_tweets():
    """Endpoint return a list of politician parties in database
        ---
        tags:
          - Twitter
        responses:
          200:
            description: A list of politician parties
          500:
            description: Error during connection
        """
    connection = get_connection_database()
    if connection.get('error'):
        response = make_response({'error': 'Error during connection'}, 500, HEADERS)
        return response
    connection = connection['connection']
    cursor = connection.cursor()
    cursor.execute(f"SELECT name, abbr "
                   f"FROM political_parties ORDER BY name;")
    result = cursor.fetchall()
    response = []
    for row in result:
        response.append({'name': row[0],
                         'short_name': row[1],
                         })
    cursor.close()
    connection.close()
    response = make_response({'result': response}, 200, HEADERS)
    return response

# @app.route('/trends', methods=['GET'])
# @requires_auth
@app.route('/trends', methods=['GET'])
def get_trends():
    """Endpoint return a list of ordered trends (max 50)
        ---
        tags:
          - Twitter
        responses:
          200:
            description: A list of sorted trends by popularity
          500:
            description: Error during connection
        """
    connection = get_connection_database()
    if connection.get('error'):
        response = make_response({'error': 'Error during connection'}, 500, HEADERS)
        return response
    connection = connection['connection']
    cursor = connection.cursor()
    cursor.execute(f"select word, is_politic_search, is_politic_party_search from find_statistics order by qty DESC LIMIT 50;")
    result = cursor.fetchall()
    response = []
    for row in result:
        response.append({'phrase': row[0],
                         'is_politic_search': row[1],
                         'is_politic_party_search': row[2],
                         })
    cursor.close()
    connection.close()
    response = make_response({'result': response}, 200, HEADERS)
    return response

# @app.route('/polit_twitter_acc', methods=['GET'])
# @requires_auth
@app.route('/polit_twitter_acc', methods=['GET'])
def get_politicians_twitter_accounts():
    """Endpoint return a list of politiancs Twitter accounts in database
        ---
        tags:
          - Twitter
        responses:
          200:
            description: A list of politicians Twitter accounts
          500:
            description: Error during connection
        """
    connection = get_connection_database()
    if connection.get('error'):
        response = make_response({'error': 'Error during connection'}, 500, HEADERS)
        return response
    connection = connection['connection']
    cursor = connection.cursor()
    cursor.execute(f"SELECT username, name, surname "
                   f"FROM politicians "
                   f"LEFT JOIN politicians_twitter_accounts "
                   f"ON politicians_twitter_accounts.politician = politicians.id WHERE username IS NOT NULL;")
    result = cursor.fetchall()
    response = []
    for row in result:
        response.append({'twitter_name': row[0],
                         'name': row[1],
                         'surname': row[2],
                         })
    cursor.close()
    connection.close()
    response = make_response({'result': response}, 200, HEADERS)
    return response

# @app.route('/polit_party_twitter_acc', methods=['GET'])
# @requires_auth
@app.route('/parties_twitter_acc', methods=['GET'])
def get_politicians_party_twitter_accounts():
    """Endpoint return a list of politician parties Twitter accounts in database
        ---
        tags:
          - Twitter
        responses:
          200:
            description: A list of politicians parties Twitter accounts
          500:
            description: Error during connection
        """
    connection = get_connection_database()
    if connection.get('error'):
        response = make_response({'error': 'Error during connection'}, 500, HEADERS)
        return response
    connection = connection['connection']
    cursor = connection.cursor()
    cursor.execute(f"SELECT username, name "
                   f"FROM political_parties "
                   f"LEFT JOIN political_parties_twitter_accounts "
                   f"ON political_parties_twitter_accounts.political_party = political_parties.id "
                   f"WHERE username IS NOT NULL;")
    result = cursor.fetchall()
    response = []
    for row in result:
        response.append({'twitter_name': row[0],
                         'name': row[1],
                         })
    cursor.close()
    connection.close()
    response = make_response({'result': response}, 200, HEADERS)
    return response


# @app.route('/latest', methods=['GET'])
# @requires_auth
@app.route('/latest', methods=['GET'])
def get_newest_tweets():
    """Endpoint return a list of latest tweets (may be limited, max returned tweets 300)
        ---
        tags:
          - Twitter
        parameters:
          - name: limit
            in: query
            type: integer
            required: false
            description: TOP limit of returned tweets
          - name: offset
            in: query
            type: integer
            required: false
            description: offset of returned tweets

        responses:
          200:
            description: A list of latest tweets max 300
          400:
            description: Bad parameter
          500:
            description: Error during connection
        """
    connection = get_connection_database()
    if connection.get('error'):
        response = make_response({'error': 'Error during connection'}, 500, HEADERS)
        return response
    connection = connection['connection']
    cursor = connection.cursor()

    limit = request.args.get('limit', False)
    offset = request.args.get('offset', False)

    try:
        if limit:
            limit = int(limit)
        if offset:
            offset = int(offset)
        if not limit or limit > 300:
            limit = 300
        if not offset:
            offset = 0
    except:
        response = make_response({'error': 'Bad parameter'}, 400, HEADERS)
        return response

    query = f"SELECT message, date, tags, url_photo, url_video, url_tweet,p.name, p.surname " \
            f"FROM politicians_tweets " \
            f'left join politicians_twitter_accounts pta on politicians_tweets."user" = pta.id ' \
            f"left join politicians p on pta.politician = p.id UNION " \
            f"SELECT ppt.message, ppt.date, ppt.tags, ppt.url_photo, ppt.url_video, ppt.url_tweet,p.name, NULL as surname " \
            f"FROM political_parties_tweets as ppt " \
            f'left join political_parties_twitter_accounts pta on ppt."user" = pta.id ' \
            f"left join political_parties p on pta.political_party = p.id " \
            f' order by date DESC LIMIT {limit} OFFSET {offset};'
    cursor.execute(query)
    result = cursor.fetchall()
    response = []
    for row in result:
        response.append({'message': row[0],
                         'date': row[1],
                         'tags': row[2],
                         'url_photo': row[3],
                         'url_video': row[4],
                         'url_tweet': row[5],
                         'name': row[6],
                         'surname': row[7],
                         })
    cursor.close()
    connection.close()
    response = make_response({'result': response}, 200, HEADERS)
    return response

# @app.route('/find_tweet', methods=['GET'])
# @requires_auth
@app.route('/find_tweet', methods=['GET'])
def find_politic_tweets():
    """Endpoint return a list of tweets searched by text
        ---
        tags:
          - Twitter
        parameters:
          - name: text
            in: query
            type: string
            required: true
            description: looking phrase in tweets (use _ instead of white space)
          - name: limit
            in: query
            type: integer
            required: false
            description: TOP limit of returned tweets. If politic and politic_party specified return double amount of limit
          - name: offset
            in: query
            type: integer
            required: false
            description: offset of returned tweets
          - name: politic
            in: query
            type: string
            required: false
            description: Politic name in format - name_surname
          - name: politic_party
            in: query
            type: string
            required: false
            description: Politic party name in format - xx_yy_zz


        responses:
          200:
            description: A list of tweets (may be filtered by politic and may be limited) max 300
          400:
            description: Bad parameter
          500:
            description: Error during connection
        """

    text = request.args.get('text', False)
    limit = request.args.get('limit', False)
    offset = request.args.get('offset', False)
    politic = request.args.get('politic', False)
    politic_party = request.args.get('politic_party', False)
    if not text:
        response = make_response({'error': 'Bad parameter'}, 400, HEADERS)
        return response
    try:
        text = str(text).replace('"', '').replace("'", '').replace(' ', '_')
        if len(text.split('_')) > 1 and text.split('_')[len(text.split('_')) - 1] == '':
            text = text.split('_')
            text.pop()
        else:
            text = text.split('_')
        text = ' & '.join(text)

        if limit:
            limit = int(limit)
        if offset:
            offset = int(offset)
        if not limit or limit > 300:
            limit = 300
        if not offset:
            offset = 0
        if politic:
            politic = politic.strip()
            politic = politic.replace('"', '').replace("'", '')
            politic_name, politic_surname = politic.split('_')
            politic_name = politic_name.capitalize()
            politic_surname = politic_surname.capitalize()
            if '-' in politic_surname:
                index = politic_surname.index('-')
                politic_surname = politic_surname[:index] + '-' + politic_surname[index + 1:].capitalize()
            if not politic_name or not politic_surname:
                raise
        if politic_party:
            politic_party = politic_party.strip()
            politic_party = politic_party.replace('"', '').replace("'", '')
            politic_party = tuple(politic_party.split('_')) if len(politic_party.split('_')) > 1 else politic_party
    except:
        response = make_response({'error': 'Bad parameter'}, 400, HEADERS)
        return response
    connection = get_connection_database()
    if connection.get('error'):
        response = make_response({'error': 'Error during connection'}, 500, HEADERS)
        return response
    connection = connection['connection']
    cursor = connection.cursor()
    # if politic and politic_party:
    #     response = make_response({'error': "Can't search on politic and politic party at same time!"}, 200, HEADERS)
    #     return response
    if politic:
        cursor.execute(f"SELECT politicians_twitter_accounts.id "
                       f"FROM politicians "
                       f"LEFT JOIN politicians_twitter_accounts "
                       f"ON politicians_twitter_accounts.politician = politicians.id "
                       f"WHERE name ilike '{politic_name}' AND surname ilike '{politic_surname}';")
        result = cursor.fetchone()
        if not result or not result[0]:
            response = make_response({'error': 'No politic found or no twitter account found'}, 200, HEADERS)
            return response
    if politic_party:
        cursor.execute('SELECT political_parties_twitter_accounts.id '
                       'FROM political_parties '
                       'LEFT JOIN political_parties_twitter_accounts '
                       'ON political_parties_twitter_accounts.political_party = political_parties.id '
                       f"WHERE name ilike '{politic_party}';")
        sec_result = cursor.fetchone()
        if not sec_result or not sec_result[0]:
            response = make_response({'error': 'No politic_party found or no twitter account found'}, 200, HEADERS)
            return response
    if (not politic_party and not politic) or (politic and not politic_party) or (politic and politic_party):
        query = f"SELECT message, date, tags, url_photo, url_video, url_tweet, polit_acc.username," \
                f" polit.name, polit.surname FROM politicians_tweets " \
                f' LEFT JOIN politicians_twitter_accounts AS polit_acc ON polit_acc.id = politicians_tweets."user" ' \
                f"LEFT JOIN politicians AS polit ON polit.id = polit_acc.politician " \
                f"WHERE finder @@ to_tsquery('{text}') "

        if politic:
            query += f' AND "user" = {int(result[0])}'
        query += f' ORDER BY date DESC OFFSET {offset} LIMIT {limit}'
        cursor.execute(query + ';')
        result = cursor.fetchall()
    else:
        result = []

    if (not politic_party and not politic) or (not politic and politic_party) or (politic and politic_party):
        query = f"SELECT message, date, tags, url_photo, url_video, url_tweet, polit_acc.username," \
                f" polit.name, NULL as surname " \
                f" FROM political_parties_tweets " \
                f' LEFT JOIN political_parties_twitter_accounts AS polit_acc ON polit_acc.id = political_parties_tweets."user" ' \
                f"LEFT JOIN political_parties AS polit ON polit.id = polit_acc.political_party " \
                f"WHERE finder @@ to_tsquery('{text}') "

        if politic_party:
            query += f' AND "user" = {int(sec_result[0])}'
        query += f' ORDER BY date DESC OFFSET {offset} LIMIT {limit}'
        cursor.execute(query + ';')
        sec_result = cursor.fetchall()
    else:
        sec_result = []

    response = []
    for row in result + sec_result:
        response.append({'message': row[0],
                         'date': row[1],
                         'tags': row[2],
                         'url_photo': row[3],
                         'url_video': row[4],
                         'url_tweet': row[5],
                         'twitter_username': row[6],
                         'name': row[7],
                         'surname': row[8],
                         })

    if len(text.split(' & ')) == 1:
        text = text.split(' & ')
    else:
        text = text.split(' & ') + [text.replace(' & ', ' ')]
    for word in text:
        query = f"SELECT id, qty, word FROM find_statistics WHERE word = '{word.lower()}' LIMIT 1"
        cursor.execute(query + ';')
        result = cursor.fetchone()
        if result:
            cursor.execute(
                f'UPDATE find_statistics SET qty = {result[1] + 1} WHERE id = {result[0]};')
            connection.commit()
        else:
            cursor.execute(
                f'INSERT INTO find_statistics (qty, word) '
                f"VALUES(1, '{word.lower()}');")
            connection.commit()

    cursor.close()
    connection.close()
    response = make_response({'result': response, 'limit': limit, 'offset': offset}, 200, HEADERS)
    return response



@app.errorhandler(404)
def page_not_found():
    return "<h1>404</h1><p>The resource could not be found.</p>", 404




if __name__ == '__main__':
    app.run(debug=True)  # na prodzie off

from functools import wraps
from flask import Flask, jsonify, request
from psycopg2 import Error
from datetime import datetime
from flasgger import Swagger

import psycopg2


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
        connection = psycopg2.connect(user="",
                                      password="",
                                      host="",
                                      port="",
                                      database="")

    except (Exception, Error) as error:
        return {'error': error}
    finally:
        return {'connection': connection}


def check_auth(username, password):
    # TODO sprawdzac w bazie danych usera
    return username == 'admin' and password == 'secret'


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


@app.route('/tweets', methods=['GET'])
@requires_auth
def get_politic_tweets():
    """Endpoint returning a list of tweets by given politic name
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
        return jsonify({'error': 'Bad parameter'}), 400
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
        return jsonify({'error': 'Bad parameter'}), 400

    connection = get_connection_database()
    if connection.get('error'):
        return jsonify('Error during connection'), 500
    connection = connection['connection']
    cursor = connection.cursor()
    cursor.execute(f"SELECT politicians_twitter_accounts.id, name, surname "
                   f"FROM politicians "
                   f"LEFT JOIN politicians_twitter_accounts "
                   f"ON politicians_twitter_accounts.politician = politicians.id "
                   f"WHERE name = '{politic_name}' AND surname = '{politic_surname}';")
    result = cursor.fetchone()
    if not result or not result[0]:
        return jsonify({'error': 'No politic found or no twitter account found'})
    query = f"SELECT message, date, tags, url_photo, url_video, url_tweet FROM politicians_tweets " \
            f'WHERE "user" = {int(result[0])}'
    if date_to:
        try:
            date_to = datetime.strptime(date_to, '%Y-%m-%d')
            query += f" AND date <= '{date_to.strftime('%Y-%m-%d')}' "
        except:
            return jsonify({'error': 'Bad parameter'}), 400
    if date_from:
        try:
            date_from = datetime.strptime(date_from, '%Y-%m-%d')
            query += f" AND date >= '{date_from.strftime('%Y-%m-%d')}' "
        except:
            return jsonify({'error': 'Bad parameter'}), 400

    query += ' ORDER BY date'
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
                         })
    cursor.close()
    connection.close()
    return jsonify(result=response)


@app.route('/polit', methods=['GET'])
def get_politicians():
    """Endpoint returning a list of politicians in database
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
        return jsonify('Error during connection'), 500
    connection = connection['connection']
    cursor = connection.cursor()
    cursor.execute(f"SELECT name, surname "
                   f"FROM politicians;")
    result = cursor.fetchall()
    response = []
    for row in result:
        response.append({'name': row[0],
                         'surname': row[1],
                         })
    cursor.close()
    connection.close()
    return jsonify(result=response)


@app.route('/polit_twitter_acc', methods=['GET'])
def get_politicians_twitter_accounts():
    """Endpoint returning a list of politiancs Twitter accounts in database
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
        return jsonify('Error during connection'), 500
    connection = connection['connection']
    cursor = connection.cursor()
    cursor.execute(f"SELECT username, name, surname "
                   f"FROM politicians "
                   f"LEFT JOIN politicians_twitter_accounts "
                   f"ON politicians_twitter_accounts.politician = politicians.id;")
    result = cursor.fetchall()
    response = []
    for row in result:
        response.append({'twitter_name': row[0],
                         'name': row[1],
                         'surname': row[2],
                         })
    cursor.close()
    connection.close()
    return jsonify(result=response)


@app.errorhandler(404)
def page_not_found():
    return "<h1>404</h1><p>The resource could not be found.</p>", 404




if __name__ == '__main__':
    app.run(debug=True)  # na prodzie off

import scrapy
from scrapy_splash import SplashRequest


class RepresentativeSpider(scrapy.Spider):
    """
    A class used to scrap Polish parliament's website to collect data about representatives.

    How to run it?
        1)  RepresentativeCrawler
            politgot\tools\data_collectors\goverment\representative_profiles\representative_crawler.py
        2)  scrapy crawl <name> -O <file_name>.<format | .json>
            scrapy representative crawl -O representative.json
            -O corresponds to overwrite and -o to append


    !!!WARNING!!!
    Unfortunately it was needed to use Polish naming in keys, because of not having always classes/ids/etc in HTML.
    """
    name: str = "representative"
    base: str = 'https://www.sejm.gov.pl/sejm9.nsf/'
    start_urls: list = [
        'https://www.sejm.gov.pl/Sejm9.nsf/poslowie.xsp',
        'https://www.sejm.gov.pl/Sejm9.nsf/poslowie.xsp?type=B'
    ]

    def __extract_css(self, response, query):
        """
        CLass to extract one element from response matching to the CSS query.
        """
        output = response.css(query).get()
        if output:
            output = output.strip()
        return output

    def __extract_nested_css(self, response, query):
        """
        CLass to extract list of elements from response matching to the CSS query.
        """
        output = response.css(query).getall()
        if output:
            output = list(map(str.strip, output))
        return output

    def parse(self, response, **kwargs):
        """
        Getting links of representatives to loop throw.
        """
        representatives = self.__extract_nested_css(response, 'ul[class*="deputies"] li div a ::attr(href)')
        yield from response.follow_all(representatives, self.click_links_in_profile)

    def click_links_in_profile(self, response):
        """
        It returns response with extra data loaded from JS functions.
        """
        script = """
        function main(splash)
            assert(splash:go(splash.args.url))
            
            speeches = splash:select('#wystapienia')
            speeches:mouse_click()
            splash:wait(1.5)
            
            votes = splash:select('#glosowania')
            votes:mouse_click()
            splash:wait(4.5)
            
            return splash:html()
        end
        """

        # Run lua script to run JS functions to load more data on the website
        yield SplashRequest(response.request.url, callback=self.parse_profile, endpoint='execute', args={
            'lua_source': script
        })

    def parse_profile(self, response):
        """
        Scrap basic data about a representative.
        """

        # Getting the easiest information to collect.
        data: dict = {
            'nazwa': self.__extract_css(response, 'h1::text'),
            'zdjęcie': self.__extract_css(response, 'div[class*="partia"] img::attr(src)'),
            'wystąpienia': self.__extract_css(response,
                                              'div[id*="view:_id1:_id2:facetMain:_id191:holdWystapienia"] '
                                              'a::attr("href")'),
            'głosowania_link': self.__extract_css(response,
                                                  'div[id*="view:_id1:_id2:facetMain:_id191:holdGlosowania"]  '
                                                  'a::attr("href")')
        }

        # It was required to match p[class*="left] to the key and the right one to the value.
        # This strategy was chosen, because the website has random order of values.
        for i, response2 in enumerate(response.css('ul[class*="data"]')):
            if i > 1:
                break
            for row in response2.css('li'):
                if self.__extract_css(row, 'p[class*="right"]::text'):
                    data[self.__extract_css(row, 'p[class*="left"]::text').strip(':')] = \
                        self.__extract_css(row, 'p[class*="right"]::text')
                else:
                    data[self.__extract_css(row, 'p[class*="left"]::text').strip(':')] = \
                        self.__extract_css(row, 'p[class*="right"] a::text')

        # go to parse_speeches if the link exists
        if data['wystąpienia']:
            yield scrapy.Request(
                self.base + data['wystąpienia'],
                callback=self.parse_speeches,
                meta={'data': data}
            )
        # go to parse_polls if the link exists and the one for speeches does not exist
        elif data['głosowania_link']:
            yield scrapy.Request(
                self.base + data['głosowania_link'],
                callback=self.parse_polls,
                meta={'data': data}
            )
        # if both link do not exist, then return the dict
        else:
            yield data

    def parse_speeches(self, response):
        data = response.meta['data']
        data['Wypowiedzi'] = []

        for row in response.css('tbody tr'):
            tds = self.__extract_nested_css(row, 'td::text')
            d = dict()
            for i, td in enumerate(tds):
                if i == 0:
                    d['Posiedzenie'] = tds[0]
                elif i == 1:
                    d['Dzień'] = tds[1]
                elif i == 2:
                    d['Data'] = tds[2]
                elif i == 3:
                    d['Numer'] = tds[3]

            d['Link'] = self.__extract_nested_css(row, 'td a::attr("href")')[0]

            data['Wypowiedzi'].append(d)

        yield scrapy.Request(
            self.base + data['Wypowiedzi'][0]['Link'],
            callback=self.parse_speech,
            meta={
                'data': data,
                'index': 0
            }
        )

    def parse_speech(self, response):
        data = response.meta['data']
        index = response.meta['index']

        if index != len(data['Wypowiedzi']):
            points = self.__extract_nested_css(response, 'p[class*="punkt-tytul"]::text')
            data['Wypowiedzi'][index]['Punkty'] = points
            data['Wypowiedzi'][index]['tekst'] = self.__extract_nested_css(response, 'div[class*="stenogram"] p::text')[
                                                 len(points):]
            if index + 1 != len(data['Wypowiedzi']):
                yield scrapy.Request(
                    self.base + data['Wypowiedzi'][index + 1]['Link'],
                    callback=self.parse_speech,
                    meta={
                        'data': data,
                        'index': index + 1
                    }
                )
            else:
                if data['głosowania_link']:
                    yield scrapy.Request(
                        self.base + data['głosowania_link'],
                        callback=self.parse_polls,
                        meta={
                            'data': data
                        }
                    )
                else:
                    yield data

    def parse_polls(self, response):
        data = response.meta['data']
        data['głosowania'] = list()

        for row in response.css('tbody tr'):
            tds = row.css('td')
            d = dict()
            for i, td in enumerate(self.__extract_nested_css(tds, '::text')):
                if i == 0:
                    d['Posiedzenie'] = td
                elif i == 1:
                    d['Data'] = td
                elif i == 2:
                    d['Ile głosowań'] = td
                elif i == 3:
                    d['Ile głosował/a'] = td
                elif i == 4:
                    d['ile opuścił/a'] = td
                elif i == 5:
                    d['udział %'] = td
                else:
                    d['uspraw'] = td
            d['url'] = self.__extract_css(row, 'td a::attr("href")')
            data['głosowania'].append(d)

        yield scrapy.Request(
            self.base + data['głosowania'][0]['url'],
            callback=self.parse_poll,
            meta={
                'data': data,
                'index': 0
            }
        )

    def parse_poll(self, response):
        data = response.meta['data']
        index = response.meta['index']

        data['głosowania'][index]['głosy'] = list()
        for i, row in enumerate(response.css('tbody tr')):
            tds = self.__extract_nested_css(row, 'td::text')
            td_links = self.__extract_nested_css(row, 'td a::text')
            d: dict = dict()

            if i + 2 == len(response.css('tbody tr').getall()):
                break

            d['Numer'] = td_links[0]
            d['Godzina'] = tds[0]
            d['Wynik'] = tds[1]

            d['Temat'] = tds[2]
            if len(td_links) > 1:
                d['Temat'] = d['Temat'] + td_links[1]

            data['głosowania'][index]['głosy'].append(d)

        if index + 1 == len(data['głosowania']):
            yield data
        else:
            yield scrapy.Request(
                self.base + data['głosowania'][index + 1]['url'],
                callback=self.parse_poll,
                meta={
                    'data': data,
                    'index': index + 1
                }
            )

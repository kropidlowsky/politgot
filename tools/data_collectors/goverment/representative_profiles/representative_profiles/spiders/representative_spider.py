import scrapy


class RepresentativeSpider(scrapy.Spider):

    name: str = "rep"
    start_urls = [
        'https://www.sejm.gov.pl/Sejm9.nsf/poslowie.xsp'
    ]

    def __extract_css(self, response, query):
        """
        asks css query in response and returns an output string
        :param response: website's response
        :param query: css query
        :return: css output string
        """
        output = response.css(query).get()
        if output:
            output = output.strip()
        return output

    def __extract_nested_css(self, response, query):
        """
        asks css query in response and returns an output list
        :param response: website's response
        :param query: css query
        :return: css output list
        """
        output = response.css(query).getall()
        if output:
            output = list(map(str.strip, output))
        return output

    def parse(self, response, **kwargs):
        representatives = self.__extract_nested_css(response, 'ul[class*="deputies"] li div a ::attr(href)')
        yield from response.follow_all(representatives, self.parse_profile)

    def parse_profile(self, response):
        yield {
            'name': self.__extract_css(response, 'div[id*="title_content"] h1::text'),
            'elect_date': self.__extract_css(response, 'p[class*="right"]::text'),
            'register': self.__extract_nested_css(response, 'p[class*="right"]::text')[1],
            'votes': self.__extract_nested_css(response, 'p[class*="right"]::text')[3],
            'constituency': self.__extract_css(response, 'p[id*="okreg"]::text'),
            'vow_date': self.__extract_nested_css(response, 'p[class*="right"]::text')[4],
            'period': self.__extract_nested_css(response, 'p[class*="right"]::text')[5].split(', '),
            'clubs': self.__extract_css(response, 'a[id*="view:_id1:_id2:facetMain:_id109:klub"]::text').split(', '),

            'DOB': self.__extract_css(response, 'p[id*="urodzony"]::text').split(', ')[0],
            'POB': self.__extract_css(response, 'p[id*="urodzony"]::text').split(', ')[1],
            'education': self.__extract_nested_css(response, 'div[class*="cv"] ul li p[class*="right"]::text')[1],
            'schools': self.__extract_nested_css(response, 'div[class*="cv"] ul li p[class*="right"]::text')[2:-2],
            'profession': self.__extract_nested_css(response, 'div[class*="cv"] ul li p[class*="right"]::text')[-1]
        }

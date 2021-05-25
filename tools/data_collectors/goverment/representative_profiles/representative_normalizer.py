from representative_crawler import RepresentativeCrawler
import datetime
import json


class RepresentativeNormalizer:
    def __init__(self):
        crawler = RepresentativeCrawler()
        self.data: list = crawler.get_data()
        del crawler
        self.normalize()

    def str_to_date(self, date_str: str):
        print(datetime.datetime.strptime(date_str, '%d-%m-%Y'))

    def normalize(self):
        for datum in self.data:
            self.normalize_name(datum)
            self.normalize_elect_date(datum)
            self.normalize_period(datum)
            self.normalize_dob_pob(datum)

    def normalize_name(self, representative: dict):
        # 'Imię': 'Rafał', 'Nazwisko': 'Adamczyk'
        name = representative.pop('nazwa').split()
        representative['Imię'] = " ".join(name[0:-1])
        representative['Nazwisko'] = name[-1]

    def normalize_elect_date(self, representative: dict):
        # 'Płeć': 'męska'
        # 'Dzień wybrania': '13-10-2019'
        if representative.get('Wybrany dnia'):
            representative['Płeć'] = 'męska'
            representative['Dzień wybrania'] = representative.pop('Wybrany dnia')
        elif representative.get('Wybrana dnia'):
            representative['Płeć'] = 'żeńska'
            representative['Dzień wybrania'] = representative.pop('Wybrana dnia')

    def normalize_period(self, representative: dict):
        # 'Staż parlamentarny': ['poseł II kadencji', 'poseł III kadencji', 'poseł IV kadencji', 'poseł VI kadencji', 'poseł VII kadencji']
        representative['Staż parlamentarny'] = [period.replace('poseł ', '').replace('kadencji', '') for period in
                                                representative.get('Staż parlamentarny').split(', ')
                                                if period != 'brak']

    def normalize_dob_pob(self, representative: dict):
        """
        Normalize day of birth and place of birth
        """
        d = representative.pop('Data i miejsce urodzenia').split(', ')
        representative['Data urodzenia'], representative['Miejsce urodzenia'] = d[0], d[1]


if __name__ == '__main__':
    r = RepresentativeNormalizer()
    d = r.data
    with open('data.json', 'w') as fp:
        json.dump(d, fp)
    # d = {'nazwa': 'Piotr Babinetz', 'url': 'https://www.sejm.gov.pl/Sejm9.nsf/posel.xsp?id=014&type=A',
    #      'Wybrany dnia:': '13-10-2019', 'Lista:': 'Prawo i Sprawiedliwość', 'Okręg wyborczy:': '22\xa0\xa0Krosno',
    #      'Liczba głosów:': '13360', 'Ślubowanie:': '12-11-2019',
    #      'Staż parlamentarny:': 'poseł VI kadencji, poseł VII kadencji, poseł VIII kadencji',
    #      'Klub/koło:': 'Klub Parlamentarny Prawo i Sprawiedliwość', 'Data i miejsce urodzenia:': '09-09-1969, Krosno',
    #      'Wykształcenie:': 'wyższe',
    #      'Ukończona szkoła:': 'Uniwersytet Wrocławski, Wydział Nauk Historycznych i Pedagogicznych, Historia - magister (2007)',
    #      'Zawód:': 'historyk'}
    #
    # di = {"nazwa": "Andrzej Adamczyk", "url": "https://www.sejm.gov.pl/Sejm9.nsf/posel.xsp?id=001&type=A", "Wybrany dnia:": "13-10-2019", "Lista:": "Prawo i Sprawiedliwo\u015b\u0107", "Okr\u0119g wyborczy:": "13\u00a0\u00a0Krak\u00f3w", "Liczba g\u0142os\u00f3w:": "29686", "\u015alubowanie:": "12-11-2019", "Sta\u017c parlamentarny:": "pose\u0142 V kadencji, pose\u0142 VI kadencji, pose\u0142 VII kadencji, pose\u0142 VIII kadencji", "Klub/ko\u0142o:": "Klub Parlamentarny Prawo i Sprawiedliwo\u015b\u0107", "Data i miejsce urodzenia:": "04-01-1959, Krzeszowice", "Wykszta\u0142cenie:": "wy\u017csze", "Uko\u0144czona szko\u0142a:": "Spo\u0142eczna Akademia Nauk w \u0141odzi, Wydzia\u0142 Zarz\u0105dzania, Rachunkowo\u015bc i finanse w zarz\u0105dzaniu - licencjat (2014)", "Zaw\u00f3d:": "parlamentarzysta"}
    # print(di.get())
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
    with open('representative_fix.json', 'w') as fp:
        json.dump(d, fp)
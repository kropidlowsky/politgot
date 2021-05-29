from representative_crawler import RepresentativeCrawler
from datetime import datetime
import json
import base64
import requests
import re


class RepresentativeNormalizer:
    def __init__(self):
        self.data: list = []

    def crawl_data(self):
        crawler = RepresentativeCrawler()
        self.data: list = crawler.get_data()

    def get_data_from_file(self, file_name):
        with open(file_name, 'r') as f:
            self.data = json.load(f)

    def normalize(self):
        for datum in self.data:
            self.normalize_name(datum)
            self.normalize_pic(datum)
            self.normalize_elect_date(datum)
            self.normalize_period(datum)
            self.normalize_yob_pob(datum)
            self.normalize_speeches(datum)
            self.normalize_polls(datum)

    def normalize_name(self, representative: dict):
        """
        Normalize day of birth and place of birth based on a string with sum of them.
        """
        name = representative.pop('nazwa').split()
        representative['Imię'] = name[0]
        representative['Nazwisko'] = name[-1]

    def normalize_pic(self, representative: dict):
        """
        Change value of picture(zdjęcie) from url to base64
        """
        if representative.get('zdjęcie'):
            try:
                representative['zdjęcie'] = base64.b64encode(requests.get(representative['zdjęcie']).content).decode()
            except Exception as e:
                print(f"Cannot open {representative.get('zdjęcie')}.\n{e}")

    def normalize_elect_date(self, representative: dict):
        if representative.get('Wybrany dnia'):
            representative['Płeć'] = 'męska'
            representative['Dzień wybrania'] = representative.pop('Wybrany dnia')
        elif representative.get('Wybrana dnia'):
            representative['Płeć'] = 'żeńska'
            representative['Dzień wybrania'] = representative.pop('Wybrana dnia')

    def normalize_period(self, representative: dict):
        """
        Split parliament period(Staż parlamentarny) and clean data.
        """
        representative['Staż parlamentarny'] = [period.replace('poseł ', '').replace('kadencji', '') for period in
                                                representative.get('Staż parlamentarny').split(', ')
                                                if period != 'brak']

    def normalize_yob_pob(self, representative: dict):
        """
        Normalize date of birth(Data urodzenia) and place of birth(Miejsce urodzenia) based on a string with sum of them
        (Data i miejsce urodzenia).
        """
        d = representative.pop('Data i miejsce urodzenia').split(', ')
        representative['Data urodzenia'], representative['Miejsce urodzenia'] = d[0], d[1]

    def normalize_speeches(self, representative: dict):
        speeches = representative.get("Wypowiedzi")
        if speeches:
            for speech in speeches:
                speech['tekst'] = "/n".join(re.sub(r'\(.*\)', '', text) for text in speech['tekst'] if re.sub(
                    r'\(.*\)', '', text))
                speech['tekst'] = speech['tekst'].replace("\n\n", "\n").replace("'", '"').strip()
                speech['Punkty'] = '/n'.join(speech['Punkty'])

    def normalize_polls(self, representative: dict):
        root_polls = representative.get('głosowania')
        if root_polls:
            for root_poll in root_polls:
                polls = root_poll.get('głosy')
                for poll in polls:
                    if poll.get('Temat'):
                        poll['Temat'] = poll.get('Temat').replace("'", '')
                        poll['Godzina'] = poll['Godzina'] + ':00'


if __name__ == '__main__':
    r = RepresentativeNormalizer()
    r.get_data_from_file('representative.json')
    r.normalize()
    print(r.data[2].get('Wypowiedzi'))

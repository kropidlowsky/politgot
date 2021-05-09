from scrapy import signals
from scrapy.crawler import Crawler, CrawlerProcess


import json

from representative_profiles.spiders.representative_spider import RepresentativeSpider


class RepresentativeCrawler:
    def __init__(self):
        self.__items = []
        self.__crawler = Crawler(RepresentativeSpider)

    def __collect_items(self, item, response, spider):
        self.__items.append(item)

    def get_data(self):
        self.__crawler.signals.connect(self.__collect_items, signals.item_scraped)
        process = CrawlerProcess()
        d = process.crawl(self.__crawler)
        process.start()
        return self.__items

    def save_data_to_file(self, filename="representatives.json"):
        with open(filename, 'w') as f:
            json.dump(self.get_data(), f)


if __name__ == "__main__":
    r = RepresentativeCrawler()
    r.save_data_to_file()


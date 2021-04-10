# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class RepresentativeProfilesItem(scrapy.Item):
    # define the fields for your item here like:
    name = scrapy.Field()
    elect_date = scrapy.Field()
    register = scrapy.Field(serialized=str)
    votes = scrapy.Field()
    constituency = scrapy.Field()
    vow_date = scrapy.Field()
    period = scrapy.Field()
    clubs = scrapy.Field()

    DOB = scrapy.Field()
    POB = scrapy.Field()
    education = scrapy.Field()
    schools = scrapy.Field()
    profession = scrapy.Field()

import sys
import datetime
from pymongo import MongoClient

INDOOR_TEMPERATURE_DATA = [
    {
        'celsius': 29.600000381469727,
        'date': datetime.datetime(2014, 1, 27, 3, 46, 53, 20000),
        'fahrenheit': 85.28000068664551
    },
    {
        'celsius': 29.200000762939453,
        'date': datetime.datetime(2014, 1, 27, 3, 51, 22, 875000),
        'fahrenheit': 84.56000137329102
    },
    {
        'celsius': 28.5,
        'date': datetime.datetime(2014, 1, 28, 0, 55, 28, 826000),
        'fahrenheit': 83.30000000000001
    },
    {
        'celsius': 28.799999237060547,
        'date': datetime.datetime(2014, 1, 28, 1, 10, 42, 159000),
        'fahrenheit': 83.83999862670899
    },
    {
        'celsius': 26.399999618530273,
        'date': datetime.datetime(2014, 1, 29, 23, 30, 4, 658000),
        'fahrenheit': 79.5199993133545
    }
]

INDOOR_HUMIDITY_DATA = [
    {
        'date': datetime.datetime(2014, 1, 27, 3, 34, 36, 885000),
        'percent': 20
    },
    {
        'date': datetime.datetime(2014, 1, 27, 3, 45, 33, 379000),
        'percent': 20
    },
    {
        'date': datetime.datetime(2014, 1, 27, 3, 46, 53, 939000),
        'percent': 18.899999618530273
    },
    {
        'date': datetime.datetime(2014, 1, 27, 3, 51, 23, 173000),
        'percent': 18.899999618530273
    },
    {
        'date': datetime.datetime(2014, 1, 28, 0, 55, 28, 829000),
        'percent': 12.800000190734863
    }
]

SYSTEM_TEMPERATURE_DATA = []
SYSTEM_MEMORY_DATA = []
SYSTEM_STORAGE_DATA = []
SYSTEM_CONFIG_DATA = []
STARBUG_TEMPERATURE_DATA = []
BUS_STOP_CONFIG_DATA = []
NEWS_ARTICLE_SOURCE_CONFIG_DATA = []
NEWS_ARTICLE_KEYWORD_DATA = []
NEWS_ARTICLE_DATA = []


def rebuild_data(collection, dummy_data):
    collection.remove()
    collection.insert(dummy_data)


def get_database():
    client = MongoClient(sys.argv[1])
    return client.get_default_database()


if __name__ == "__main__":

    database = get_database()

    rebuild_data(database['indoortemperaturedatas'], INDOOR_TEMPERATURE_DATA)
    rebuild_data(database['indoorhumiditydatas'], INDOOR_HUMIDITY_DATA)
    rebuild_data(database['systemtemperaturedatas'], SYSTEM_TEMPERATURE_DATA)
    rebuild_data(database['systemmemorydatas'], SYSTEM_MEMORY_DATA)
    rebuild_data(database['systemstoragedatas'], SYSTEM_STORAGE_DATA)
    rebuild_data(database['systemconfigdatas'], SYSTEM_CONFIG_DATA)
    rebuild_data(database['starbugtemperaturedatas'], STARBUG_TEMPERATURE_DATA)
    rebuild_data(database['busstopconfigs'], BUS_STOP_CONFIG_DATA)
    rebuild_data(database['newsarticlekeywords'], NEWS_ARTICLE_SOURCE_CONFIG_DATA)
    rebuild_data(database['newsarticlekeywords'], NEWS_ARTICLE_KEYWORD_DATA)
    rebuild_data(database['newsarticles'], NEWS_ARTICLE_DATA)

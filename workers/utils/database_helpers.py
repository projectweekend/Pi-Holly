from pymongo import MongoClient


def get_database():
    client = MongoClient('mongodb://localhost/holly-webapp-db')
    return client['holly-webapp-db']


def get_collection(collection_name):
    db = get_database()
    return db[collection_name]


def get_documents_for_collection(collection_name):
    collection = get_collection(collection_name)
    return [d for d in collection.find()]


def empty_articles_collection():
    articles_collection = get_collection('newsarticles')
    articles_collection.remove()


def populate_articles_collection(articles_list):
    articles_collection = get_collection('newsarticles')
    for a in articles_list:
        articles_collection.insert({
            'title': a.title,
            'summary': a.summary,
            'url': a.url,
            'keywords': a.keywords
        })

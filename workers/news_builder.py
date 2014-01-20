import utils


def get_source_urls():
    article_sources = utils.get_documents_for_collection('newssourceconfigs')
    return [a['url'] for a in article_sources]


def article_is_complete(article):
    if not article.title:
        return False
    if not article.summary:
        return False
    if not article.image_url:
        return False
    return True


def worker():

    source_urls = get_source_urls()
    papers = utils.get_newspapers(source_urls)

    processed_articles = []
    for paper in papers:
        processed_articles += utils.process_articles_for_paper(paper)

    articles_collection = utils.get_collection('newsarticles')
    # empty collection before filling with new articles
    articles_collection.remove()
    # put new articles in the collection
    for article in processed_articles:
        # Only add an article if it is "complete"
        if article_is_complete(article):
            articles_collection.insert({
                'title': article.title,
                'summary': article.summary,
                'image_url': article.top_image,
                'url': article.url,
                'keywords': article.keywords
            })


if __name__ == "__main__":
    worker()

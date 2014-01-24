import utils


def get_source_urls():
    article_sources = utils.get_documents_for_collection('newssourceconfigs')
    return [a['url'] for a in article_sources]


def article_is_complete(article):
    if not article.title:
        return False
    if not article.summary:
        return False
    if not article.top_image:
        return False
    return True


def build_keyword_dictionaries():
    output = {
        'by_word': {},
        'by_score': {}    
    }
    result = utils.get_documents_for_collection('newsarticlekeywords')
    for i in result:
        word = i['word']
        score = i['score']

        output['by_word'][word] = score
        if output['by_score'].get(score, ''):
            output['by_score'][score].append(word)
        else:
            output['by_score'][score] = [word]
    return output


def enough_keyword_data(keyword_dictionaries):
    i = 0
    if len(keyword_dictionaries['by_word']) > 100:
        i += 1
    if 3 in keyword_dictionaries['by_score'].keys():
        i += 1
    return i == 2


def article_is_interesting(article, keywords_by_word):
    for kw in article['keywords']:
        if keywords_by_word.get(kw, 1) < 1:
            return False
    return True


def worker():

    source_urls = get_source_urls()
    papers = utils.get_newspapers(source_urls)

    processed_articles = []
    for paper in papers:
        processed_articles += utils.process_articles_for_paper(paper)

    keyword_dictionaries = build_keyword_dictionaries()
    has_enough_keyword_data = enough_keyword_data(keyword_dictionaries)

    articles_collection = utils.get_collection('newsarticles')
    
    # empty collection before filling with new articles
    articles_collection.remove()

    # put new articles in the collection
    for article in processed_articles:
        # Only add an article if it is "complete"
        if article_is_complete(article):
            if has_enough_keyword_data and article_is_interesting(article, keyword_dictionaries['by_word']):
                articles_collection.insert({
                    'title': article.title,
                    'summary': article.summary,
                    'image_url': article.top_image,
                    'url': article.url,
                    'keywords': article.keywords
                })


if __name__ == "__main__":
    worker()

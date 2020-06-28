FROM rasa/rasa:latest-full

USER root

RUN python -m spacy download fr_core_news_md && \
    python -m spacy link fr_core_news_md fr

ENTRYPOINT ["rasa"]
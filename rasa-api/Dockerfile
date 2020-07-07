FROM rasa/rasa:latest-full

USER root

RUN python -m spacy download fr_core_news_md && \
    python -m spacy link fr_core_news_md fr


# will be available with spacy 2.3.0

#RUN python -m spacy download fr_core_news_lg && \
#    python -m spacy link fr_core_news_lg fr

ENTRYPOINT ["rasa"]
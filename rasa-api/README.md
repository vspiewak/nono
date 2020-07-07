## rasa-api    

    # build image
    docker build -t nono-rasa-api -f Dockerfile .

    # init project
    docker run -u 1000 -v $(pwd):/app nono-rasa-api init --no-prompt

    # train model
    rm models/*; docker run -u 1000 -v $(pwd):/app nono-rasa-api train nlu --debug

    # start duckling server
    docker run -p 8000:8000 rasa/duckling

    # run rasa server
    docker run -u 1000 -v $(pwd):/app --net='host' nono-rasa-api run --enable-api -m models --debug

    # sample request
    curl localhost:5005/model/parse -d '{"text":"Hi !"}' | jq

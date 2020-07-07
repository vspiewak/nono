const axios = require('axios')

let rasaUri = 'http://localhost:5005'
let defaultMinConfidence = 0.6

const rasaMiddleware = (config) => {
    
    if (config) {
        
        if (!config.uri) {
            rasaUri = config.uri
        }

        if (!config.minConfidence) {
            defaultMinConfidence = config.minConfidence
        }

    }
    
    const middleware = {

        receive: (bot, message, next) => {
            
            console.log(message.type, message.text)
            
            // bypass empty or bot messages
            if (!message.text || message.is_echo || message.type === 'bot_message') {
                next()
                return
            }

            // call rasa api
            axios({
                baseURL: rasaUri,
                url: '/model/parse',
                method: 'post',
                data: {
                    text: message.text
                }
            })
            // append rasa response
            .then((r) => {

                console.log(r.data.intent)

                message.intent = r.data.intent
                message.entities = r.data.entities  

            })
            // on error
            .catch((err) => {
            
                console.log('rasa error', err)
            
            })
            // finally
            .finally(() => {

                // next middleware
                next()

            })
        
        }

    }
    
    return middleware

}

const intent = (intents, minConfidence = defaultMinConfidence) => async (message) => {
    
    // bypass if not intent
    if (!message.intent || !message.intent.name) return false

    // bypass if confidence too low
    if (message.intent.confidence < minConfidence) return false

    // matching function
    const match = (e) => message.intent.name === e

    // if intent is a string
    if (typeof intents === 'string') {
        return match(intents)
    }

    // if intent is an array
    return intents.some(match)

}

module.exports = {
    rasaMiddleware,
    intent
}
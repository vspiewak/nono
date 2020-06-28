const axios = require('axios')

let rasaUri = 'http://localhost:5005'
let minConfidence = 0.6

const rasaMiddleware = (config) => {
    
    if (config) {
        
        if (!config.uri) {
            rasaUri = config.uri
        }

        if (!config.minConfidence) {
            minConfidence = config.minConfidence
        }

    }
    
    const middleware = {

        receive: (bot, message, next) => {
            
            // bypass empty or echo message
            if (!message.text || message.is_echo) {
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

                const confidence = r.data.intent.confidence
                
                if (confidence >= minConfidence) {
                    message.intent = r.data.intent
                    message.entities = r.data.entities    
                }

            })
            // on error
            .catch((err) => {
            
                console.log('rasa error', err.message)
            
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

const intent = (intents) => async (message) => {
    
    // bypass if not intent
    if (!message.intent || !message.intent.name) return false

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
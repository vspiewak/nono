const { rasa, replyToSlack } = require('../services')  

module.exports = (controller) => {

    controller.hears('rasa','direct_message,direct_mention', async(bot, message) => {

        const msg = message.text.replace('rasa ', '')
        
        await rasa(msg)
                .then((r) => '```' + JSON.stringify(r.data, null, 3) + '```')
                .then(replyToSlack(bot, message))

    })

}
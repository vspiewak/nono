const { duckling, replyToSlack } = require('../services')  

module.exports = (controller) => {

    controller.hears('duckling','direct_message,direct_mention', async(bot, message) => {

        const msg = message.text.replace('duckling ', '')
        
        await duckling(msg)
                .then((r) => '```' + JSON.stringify(r.data, null, 3) + '```')
                .then(replyToSlack(bot, message))

    })

}
const { rasaStatus, rasaVersion, rasaParse, replyToSlack } = require('../services')  

module.exports = (controller) => {

    //FIXME: handle http/connection error 
    controller.hears('rasa status','direct_message,direct_mention', async(bot, message) => {
        
        await rasaStatus()
                .then((r) => '```' + JSON.stringify(r.data, null, 3) + '```')
                .then(replyToSlack(bot, message))

    })

    controller.hears('rasa version','direct_message,direct_mention', async(bot, message) => {
        
        await rasaVersion()
                .then((r) => '```' + JSON.stringify(r.data, null, 3) + '```')
                .then(replyToSlack(bot, message))

    })

    controller.hears('rasa','direct_message,direct_mention', async(bot, message) => {

        const msg = message.text.replace('rasa', '')
        
        await rasaParse(msg)
                .then((r) => '```' + JSON.stringify(r.data, null, 3) + '```')
                .then(replyToSlack(bot, message))

    })

}
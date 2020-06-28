const { intent } = require('../middlewares/rasa')

module.exports = (controller) => {

    controller.hears(intent(['greet']),'direct_message,direct_mention', async (bot, message) => {

        await bot.reply(message, 'intent greet detected')

    })

}
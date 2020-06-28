const sendToSlack = (controller, teamId, channelId) => async (msg) => {
    
    let bot = await controller.spawn(teamId)
    await bot.startConversationInChannel(channelId)
    
    if (typeof msg === 'string') {
        bot.say(msg)
    } else {
        bot.say({ blocks: msg })
    }

}

const replyToSlack = (bot, message) => async (reply) => {

    if (typeof reply === 'string') {
        await bot.reply(message, reply)
    } else {
        await bot.reply(message, { blocks: reply })
    }

}

module.exports = {
    sendToSlack,
    replyToSlack
}

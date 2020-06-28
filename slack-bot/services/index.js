const { duckling } = require('./duckling')
const { rasa } = require('./rasa')
const { sendToSlack, replyToSlack } = require('./slack')

module.exports = {
    duckling,
    rasa,
    sendToSlack,
    replyToSlack
}
const { duckling } = require('./duckling')

const { 
    isIntent, 
    containEntity, 
    entitiesOf, 
    entitiesDatePeriod 
} = require('./nlu')

const { rasa } = require('./rasa')

const { 
    sendToSlack, 
    replyToSlack 
} = require('./slack')


module.exports = {
    duckling,
    isIntent, 
    containEntity, 
    entitiesOf, 
    entitiesDatePeriod,
    rasa,
    sendToSlack,
    replyToSlack
}
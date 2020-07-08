const parseJSON = require('date-fns/parseJSON')
const startOfDay = require('date-fns/startOfDay')
const endOfDay = require('date-fns/endOfDay')
const startOfMonth = require('date-fns/startOfMonth')
const endOfToday = require('date-fns/endOfToday')
const endOfMonth = require('date-fns/endOfMonth')
const endOfYear = require('date-fns/endOfYear')
const subSeconds = require('date-fns/subSeconds')

const isIntent = (intents, minConfidence = 0.6) => (message) => {
    
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

const containEntity = (type, minConfidence = 0.6) => (message) => {

    // bypass if not entities
    if (!message.entities) return false

    // matching function
    const match = (e) => e.entity === type
    
    return message.entities.some(match)

}

const entitiesOf = (type, minConfidence = 0.6) => (message) => {

    // bypass if not entities
    if (!message.entities) return []

    return message.entities.filter(e => e.entity === type)

}

const entitiesDatePeriod = (message) => {
    
    if (containEntity('time')(message)) {

        const timeEntities = entitiesOf('time')(message)

        if (timeEntities.length == 1) {

            const timeEntity = entitiesOf('time')(message)[0]
    
            if (typeof timeEntity.value === 'string') {
    
                const startDate = startOfDay(parseJSON(timeEntity.value))
    
                if (timeEntity.additional_info.grain === 'day') {
                    const endDate = endOfDay(startDate)
                    return [startDate, endDate] 
                } else if (timeEntity.additional_info.grain === 'month') {
                    const endDate = endOfMonth(startDate)
                    return [startDate, endDate] 
                } else if (timeEntity.additional_info.grain === 'year') {
                    const endDate = endOfYear(startDate)
                    return [startDate, endDate] 
                } else {
                    console.log(`Error | unknown time period grain: ${JSON.stringify(timeEntity)}`)
                    return undefined
                }
    
            } else {
    
                const startDate = startOfDay(parseJSON(timeEntity.value.from))
                const endDate = endOfDay(parseJSON(timeEntity.value.to))
                return [startDate, endDate]
        
            }

        } else if (timeEntities.length == 2) {

            const startDate = startOfDay(parseJSON(timeEntities[0].value))
            const endDate = endOfDay(parseJSON(timeEntities[1].value))
            return [startDate, endDate] 
            
        }

    } else if (containEntity('duration')(message)) {

        const durationEntity = entitiesOf('duration')(message)[0]
        const sinceSeconds = durationEntity.additional_info.normalized.value
        const startDate = startOfMonth(subSeconds(new Date(), sinceSeconds))
        const endDate = endOfToday()
        return [startDate, endDate]
    
    } else {
    
        return undefined
    
    }

}

module.exports = {
    isIntent,
    containEntity,
    entitiesOf,
    entitiesDatePeriod
}

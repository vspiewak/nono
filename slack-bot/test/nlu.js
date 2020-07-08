const expect = require('chai').expect
//
const startOfMonth = require('date-fns/startOfMonth')
const endOfDay = require('date-fns/endOfDay')
const subMonths = require('date-fns/subMonths')
//
const { entitiesDatePeriod } = require('../services')


const hier = `
{
  "entities": [
    {
      "start": 24,
      "end": 28,
      "text": "hier",
      "value": "2020-06-30T00:00:00.000+02:00",
      "confidence": 1,
      "additional_info": {
        "values": [
          {
            "value": "2020-06-30T00:00:00.000+02:00",
            "grain": "day",
            "type": "value"
          }
        ],
        "value": "2020-06-30T00:00:00.000+02:00",
        "grain": "day",
        "type": "value"
      },
      "entity": "time",
      "extractor": "DucklingHTTPExtractor"
    }
  ]
}
`

const duXauYmois = `
{
  "entities": [
    {
      "start": 22,
      "end": 40,
      "text": "du 2 au 10 février",
      "value": {
        "to": "2021-02-11T00:00:00.000+01:00",
        "from": "2021-02-02T00:00:00.000+01:00"
      },
      "confidence": 1,
      "additional_info": {
        "values": [
          {
            "to": {
              "value": "2021-02-11T00:00:00.000+01:00",
              "grain": "day"
            },
            "from": {
              "value": "2021-02-02T00:00:00.000+01:00",
              "grain": "day"
            },
            "type": "interval"
          },
          {
            "to": {
              "value": "2022-02-11T00:00:00.000+01:00",
              "grain": "day"
            },
            "from": {
              "value": "2022-02-02T00:00:00.000+01:00",
              "grain": "day"
            },
            "type": "interval"
          },
          {
            "to": {
              "value": "2023-02-11T00:00:00.000+01:00",
              "grain": "day"
            },
            "from": {
              "value": "2023-02-02T00:00:00.000+01:00",
              "grain": "day"
            },
            "type": "interval"
          }
        ],
        "to": {
          "value": "2021-02-11T00:00:00.000+01:00",
          "grain": "day"
        },
        "from": {
          "value": "2021-02-02T00:00:00.000+01:00",
          "grain": "day"
        },
        "type": "interval"
      },
      "entity": "time",
      "extractor": "DucklingHTTPExtractor"
    }
  ]
}
`

const depuisXmois = `
{
  "entities": [
    {
      "start": 29,
      "end": 35,
      "text": "2 mois",
      "value": 2,
      "confidence": 1,
      "additional_info": {
        "value": 2,
        "month": 2,
        "type": "value",
        "unit": "month",
        "normalized": {
          "value": 5184000,
          "unit": "second"
        }
      },
      "entity": "duration",
      "extractor": "DucklingHTTPExtractor"
    }
  ]
}`

const duXauY = `
{
  "entities": [
    {
      "start": 20,
      "end": 34,
      "text": "1 janvier 2020",
      "value": "2020-01-01T00:00:00.000+01:00",
      "confidence": 1,
      "additional_info": {
        "values": [
          {
            "value": "2020-01-01T00:00:00.000+01:00",
            "grain": "day",
            "type": "value"
          }
        ],
        "value": "2020-01-01T00:00:00.000+01:00",
        "grain": "day",
        "type": "value"
      },
      "entity": "time",
      "extractor": "DucklingHTTPExtractor"
    },
    {
      "start": 37,
      "end": 47,
      "text": "aujourdhui",
      "value": "2020-07-02T00:00:00.000+02:00",
      "confidence": 1,
      "additional_info": {
        "values": [
          {
            "value": "2020-07-02T00:00:00.000+02:00",
            "grain": "day",
            "type": "value"
          }
        ],
        "value": "2020-07-02T00:00:00.000+02:00",
        "grain": "day",
        "type": "value"
      },
      "entity": "time",
      "extractor": "DucklingHTTPExtractor"
    }
  ]
}
`

describe("NLU service", () => {

  it('should parse hier', () => {
    const message = JSON.parse(hier)
    const dates = entitiesDatePeriod(message)

    expect(dates).to.be.an('array').that.have.lengthOf(2)
    expect(dates[0].toJSON()).to.be.equal('2020-06-29T22:00:00.000Z')
    expect(dates[1].toJSON()).to.be.equal('2020-06-30T21:59:59.999Z')

  })

  it('should parse du 2 au 10 février', () => {
    const message = JSON.parse(duXauYmois)
    const dates = entitiesDatePeriod(message)

    expect(dates).to.be.an('array').that.have.lengthOf(2)
    expect(dates[0].toJSON()).to.be.equal('2021-02-01T23:00:00.000Z')
    expect(dates[1].toJSON()).to.be.equal('2021-02-11T22:59:59.999Z')

  })

  it('should parse depuis 2 mois', () => {
    const message = JSON.parse(depuisXmois)
    const dates = entitiesDatePeriod(message)

    const startDate = startOfMonth(subMonths(new Date(), 2))
    const endDate = endOfDay(new Date())

    expect(dates).to.be.an('array').that.have.lengthOf(2)
    expect(dates[0].toJSON()).to.be.equal(startDate.toJSON())
    expect(dates[1].toJSON()).to.be.equal(endDate.toJSON())

  })

  it('should parse du 1 janvier 2020 à aujourdhui', () => {
  
    const message = JSON.parse(duXauY)
    const dates = entitiesDatePeriod(message)

    expect(dates).to.be.an('array').that.have.lengthOf(2)
    expect(dates[0].toJSON()).to.be.equal('2019-12-31T23:00:00.000Z')
    expect(dates[1].toJSON()).to.be.equal('2020-07-02T21:59:59.999Z')

  })
  
})

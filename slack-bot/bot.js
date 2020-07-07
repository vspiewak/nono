//  __   __  ___        ___
// |__) /  \  |  |__/ |  |  
// |__) \__/  |  |  \ |  |  

// This is the main file for the nono bot.

// Import Botkit's core features
const { Botkit } = require('botkit')

// Import a platform-specific adapter for slack.
const { SlackAdapter, SlackMessageTypeMiddleware, SlackEventMiddleware } = require('botbuilder-adapter-slack')

// Import Rasa middleware
const { rasaMiddleware } = require('./middlewares/rasa')

// Import mongo storage
const { MongoDbStorage } = require('botbuilder-storage-mongodb')

// Load process.env values from .env file
require('dotenv').config()

let storage = null
/*
if (process.env.MONGO_URI) {
    storage = mongoStorage = new MongoDbStorage({
        url : process.env.MONGO_URI,
    })
}
*/

// Create SlackAdapter
const adapter = new SlackAdapter({
    
    // parameters used to secure webhook endpoint
    clientSigningSecret: process.env.CLIENT_SIGNING_SECRET,  

    // auth token for a single-team app
    botToken: process.env.BOT_TOKEN

})

// Use SlackEventMiddleware to emit events that match their original Slack event types.
adapter.use(new SlackEventMiddleware())

// Use SlackMessageType middleware to further classify messages as direct_message, direct_mention, or mention
adapter.use(new SlackMessageTypeMiddleware())

// Setup Botkit
const controller = new Botkit({
    webhook_uri: '/api/messages',
    adapter: adapter,
    storage
})

// Use Rasa middleware
controller.middleware.receive.use(rasaMiddleware().receive)

// Once the bot has booted up its internal services, you can use them to do stuff.
controller.ready(() => {

    // load traditional developer-created local custom feature modules
    controller.loadModules(__dirname + '/features')

})

// Serve assets folder
controller.publicFolder('/assets', __dirname + '/assets')

// Health Check on GET / & GET /health
const health = (req, res) => {
    res.json({ status: 'UP', version: controller.version })
}

controller.webserver.get('/', health)
controller.webserver.get('/health', health)
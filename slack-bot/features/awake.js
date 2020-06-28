const { sendToSlack } = require('../services')

module.exports = (controller) => {

    controller.ready(async () => {

        const teamId = process.env.TEAM_ID
        const channelId = process.env.DEFAULT_CHANNEL_ID

        sendToSlack(controller, teamId, channelId)('Je viens de redémarrer :face_with_raised_eyebrow:')

    })

}
const axios = require('axios')

const rasa = async (msg) => {
    
    return axios({
        baseURL: 'http://localhost:5005',
        url: '/model/parse',
        method: 'post',
        data: {
            text: msg
        }
    })

}

module.exports = {
    rasa
}
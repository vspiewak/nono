const axios = require('axios')

const rasaURL = 'http://localhost:5005'

const rasaStatus = async (msg) => {
    
    return axios({
        baseURL: rasaURL,
        method: 'get',
        url: '/status'
    })

}

const rasaVersion = async (msg) => {
    
    return axios({
        baseURL: rasaURL,
        method: 'get',
        url: '/version'
    })

}

const rasaParse = async (msg) => {
    
    return axios({
        baseURL: rasaURL,
        url: '/model/parse',
        method: 'post',
        data: {
            text: msg
        }
    })

}

module.exports = {
    rasaStatus,
    rasaVersion,
    rasaParse
}

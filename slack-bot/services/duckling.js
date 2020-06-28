const axios = require('axios')

const duckling = async (msg) => {
    
    return axios({
        baseURL: 'http://localhost:8000',
        url: '/parse',
        method: 'post',
        data: `locale=fr_FR&text=${msg}`
    })
}

module.exports = {
    duckling
}
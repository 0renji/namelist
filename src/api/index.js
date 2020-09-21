// import store from '../store'
import request from "./request"
import papa from 'papaparse'

const baseUrl = 'https://raw.githubusercontent.com/berlinonline/haeufige-vornamen-berlin/master/data/cleaned/';

const api = {
    getNamesFor (district, year) {
        const reqUrl = this.createUrl(district, year)

        return request({
            url: reqUrl
        }).then(data => {
            const csv = papa.parse(data.data)

            console.log(csv)
        })
    },

    // helper
    createUrl (year, disctrict) {
        return baseUrl + '/' + year + '/' + disctrict + '.csv'
    },
}

export default api

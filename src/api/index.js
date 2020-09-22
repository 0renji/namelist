// import store from '../store'
import request from "./request"
import papa from 'papaparse'

const baseUrl = 'https://raw.githubusercontent.com/berlinonline/haeufige-vornamen-berlin/master/data/cleaned/';

const api = {
    // return array of arrays or null
    getNamesFor (district, year) {
        const reqUrl = this.createUrl(district, year)

        return request({
            url: reqUrl
        }).then(data => {
            if (data.data) {
                return papa.parse(data.data)
            } else {
                return null
            }
        })
    },

    // helper
    createUrl (year, disctrict) {
        return baseUrl + '/' + year + '/' + disctrict + '.csv'
    },
}

export default api

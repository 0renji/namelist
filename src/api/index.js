// import store from '../store'
import request from "./request";

const baseUrl = 'https://raw.githubusercontent.com/berlinonline/haeufige-vornamen-berlin/master/data/cleaned/';

const api = {
    getNamesFor (district, year) {
        const reqUrl = this.createUrl(district, year)

        return request({
            url: reqUrl
        }).then(data => {
            const blob = this.createCsv(data.data)
            const csv = this.parseCsv(blob)

            console.log(csv)
        })
    },

    // helper
    createUrl (year, disctrict) {
        return baseUrl + '/' + year + '/' + disctrict + '.csv'
    },

    createCsv(data) {
       return new Blob([data], {
            type: "text/comma-separated-values",
        });
       },

    parseCsv(blob) {
        const results = []
        let fs = new FileReader()
        fs.readAsArrayBuffer(blob)

    }
}

export default api

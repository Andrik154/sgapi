import request from "request-promise-native";

class Session {
    constructor(at, ESRNSec, api){
        this.at = at;
        this.api = api;
        this.ESRNSec = ESRNSec;
    }
    async post(url='/', data={}, optional={}){
        let opts = {...optional, headers:{'cookie':this.ESRNSec, 'at':this.at}};
        let promise = request(this.api+url, {
            method:'POST',
            data:data,
            headers:{
                'at':this.at,
                'cookie':this.ESRNSec
            }
        })
        return promise
    }
    async get(url='/', data={}, optional={}){
        let opts = {};
        let promise = request(this.api+url, {
            method:'GET',
            qs:data,
            headers:{
                'at':this.at,
                'cookie':this.ESRNSec
            }
        })
        return promise
    }
}

export default Session;
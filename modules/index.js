import axios from 'axios';
import request from 'async-request';
import md5 from 'md5';
import utf8 from 'utf8';

import Session from './session.js';
import Announcements from './announcements.js';
import Api from './api.js';

export class SGApi{
    constructor(api, params={}, credentials={login:'', password:''}){
        this.api = api;
        this.credentials = credentials;
        this.authData = {};
        this.params=Object.assign({cid:2, sid:11}, params);
        this._initialized = this._initialize();
    }
    async _initialize(){
        this.lf = await this.prepareLoginForm();
    }
    setParams(params){
        this.params = Object.assign({cid:2, sid:11}, params);
    }
    setCredentials(credentials = {login:'', password:''}){
        this.credentials = credentials;
    }
    async prepareLoginForm(params=this.params){
        let res = (await axios.get(this.api+'/prepareloginform', {
            params: params
        })).data;
        let lf = (({countries,cid,states,provinces, funcs,schools})=>({countries,cid,states,provinces, funcs,schools}))(res);
        return lf;
    }
    async loginForm(params=this.params){
        let res = (await axios.get(this.api+'/loginform', {
            params: Object.assign(this.params, params)
        })).data;
        let lf = (({items})=>({items}))(res);
        return lf;
    }
    async getProvinces(params){
        let res = await this.loginForm(Object.assign(params, {LASTNAME:"sid"}));
        return res;
    }
    async getCities(params){
        let res = await this.loginForm(Object.assign(params, {LASTNAME:"pid"}));
        return res;
    }
    async getFuncs(params){
        let res = await this.loginForm(Object.assign(params, {LASTNAME:"cn"}));
        return res;
    }
    async getSchools(params){
        let res = await this.loginForm(Object.assign(params, {LASTNAME:"sft"}));
        return res;
    }
    async getdata(){
        let res = (await axios.post(this.api+'/auth/getdata','',{headers:{'X-Requested-With':'XMLHttpRequest',mode:'cors','user-agent':'Chrome/95.0.4638.69'}}));
        let cookie = res.headers['set-cookie'];
        return {data: res.data, cookie};
    }
    async auth(){
        let getdata = (await this.getdata());
        let data = getdata.data;
        let cookie = getdata.cookie;
        let passhash = md5(this.credentials.password);
        let truehash = md5(data.salt+passhash);
        let payload = {
            loginType: 1,
            ...this.params,
            UN: this.credentials.login,
            PW: truehash.slice(0,this.credentials.password.length),
            lt: data.lt,
            pw2: truehash,
            ver: data.ver
        }
        const params = new URLSearchParams()
        for (let key of Object.keys(payload)){
            params.append(key, payload[key]);
        }
        let res = (await axios.post(this.api+'/login', utf8.encode(params.toString()), {headers:{'cookie':cookie, 'referer':this.api}}));
        if (res.status==200 && Object.keys(res.data).includes('at')){
            let api_obj = new Api(new Session(res.data.at, res.headers['set-cookie'][0].split(';')[0], this.api));
            await api_obj._initialized;
            this.a=api_obj;
            return true;
        } else {
            if (res.status==409){
                return false
            } else {
                throw new Error('Could be network error');
            }
        }
    }
}
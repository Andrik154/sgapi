import {SGApi} from './modules/index.js';
import md5 from 'md5';
let x = new SGApi('https://giseo.rkomi.ru/webapi/');
x._initialized.then(()=>{
    // x.getSchools({
    //     pid: -168,
    //     cn: 168,
    //     sft:2
    // }).then((r)=>console.log(r));
    x.setParams({pid:-168,cn:168,sft:2,scid:118});
    x.setCredentials({login:'литовеца',password:'andrik154'});
    x.auth().then(r=>{
        // x.a.getAnnouncements().then(e=>console.log(e));
        x.a.student.debts().then(e=>console.log(e));
        // console.log(x.a)
    });

})
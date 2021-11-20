import Session from "./session.js";
import Announcements from "./announcements.js";
import Student from "./student.js";

class Api {
    constructor(session){
        this.session = session;

        this._initialized = this._initialize();
    }
    async _initialize(){
        this.student = new Student(this.session);

        return Promise.all([
            this.student._initialized
        ])
    }
    async getAnnouncements(){
        this.announcements = new Announcements(this.session);
        let list = await this.announcements.getAnnouncements();
        return JSON.parse(list.body);
    }
}

export default Api;
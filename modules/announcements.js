import Session from "./session.js";

class Announcements {
    constructor(session){
        this.session = session;
        this._initialized = this._initialize();
    }
    async _initialize(){
        // this.getAnnouncements()
    }
    async getAnnouncements(take=-1){
        return this.session.get('/announcements',{take:take});
    }
    
}

export default Announcements;
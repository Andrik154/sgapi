
class Student {
    constructor (session){
        this.session = session;
        this._initialized = this._initialize();
    }
    async _initialize(){
        return Promise.all([
            this.init = JSON.parse(await this.session.get('/student/diary/init')),
            this.year = JSON.parse(await this.session.get('/years/current'))
            /*
            {
                globalYearId: 21,
                schoolId: 118,
                startDate: '2021-09-01T00:00:00',
                endDate: '2022-08-31T00:00:00',
                name: '2021/2022',
                archiveStatus: { status: 0, date: null },
                status: 'Open',
                weekEndSet: 1,
                id: 78766
            }*/
        ])
    }
    async getDiary(weekStart,weekEnd){
        return this.session.get('/student/diary',{studentId:this.init.students[0].studentId,yearId:this.year.id, weekStart, weekEnd});
    }
    async debts(){
        return JSON.parse(await this.session.get('/student/diary/pastMandatory',{studentId:this.init.students[0].studentId,yearId:this.year.id})).sort((a,b)=>new Date(a).getTime()-new Date(b).getTime());
    }
}

export default Student;
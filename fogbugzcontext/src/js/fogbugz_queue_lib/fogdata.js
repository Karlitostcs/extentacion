var fogdata = {
    data_key:'fogqueuedata',
    get_all:function(){
        if(localStorage.getItem(this.data_key)!= null){
            return {status:"ok",data:JSON.parse(localStorage.getItem(this.data_key))}
        }
        return {status:"error",message:"there are no cases in fogqueue!"}

    },
    get_by_case_id:function(case_id){
        let allcases = this.get_all()
        if(allcases.status == "ok"){
            for(let i=0;i<allcases.data.length;i++){
                if(allcases.data[i].case_id == case_id){
                    return {status:"ok",data:allcases.data[i]}
                }
            }
            return {status:"error",message:"no case with case id:  "+case_id+", found in the fogqueue!"}
        }
        else{
            return allcases
        }
    },
    update_cases: async function(){
        let cases = this.get_all()
        if(cases.status == "ok"){
            for(let i=0;i<cases.data.length;i++){
                let new_data = await fogbugz_api.getCaseById(cases.data[i].case_id)
                if(new_data.status == "ok"){
                    cases.data[i] = new_data.data
                }
            }
        }
    },
    saveAll:function(fogqueue){
        localStorage.setItem(this.data_key,JSON.stringify(fogqueue))
    },
    removeAll:function(){
        localStorage.removeItem(this.data_key)
    },
    removeCase(case_id){
        let cases = this.get_all()
        if(cases.status == "ok"){
           //remove case of case_id
           cases.data = cases.data.filter(function(v,i,d){return v.case_id!=case_id})
           this.saveAll(cases.data)
        }
    },
    addNewCase:function(case_data){
        if(this.get_by_case_id(case_data.case_id)=="ok"){
            return {status:"error",message:"case already exists in fogueue!"}
        }
        else {
            let cases = {}
            if(localStorage.getItem(this.data_key)!=null){
                cases = this.get_all()
                console.log('if')
            } 
            else{
                cases = {data:[]}
                console.log('else')
            }
            cases.data.push(case_data)
            console.log(cases,case_data)
            this.saveAll(cases.data)
        }
    }

}
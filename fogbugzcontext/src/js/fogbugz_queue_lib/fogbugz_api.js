var fogbugz_api = {
    token:"f4msj9oirh9eqiakp1392tm6hhlbmk",
    searchString:`http://fogbugz.tcsgeeks.com/api.asp?cmd=search&cols=ixBug,sTitle,sStatus&q=case:`,
    getCaseById: async function(case_id){
        let searchURL = this.searchString+case_id+`&token=${this.token}`
        , data = await fetch(searchURL).then(function(response){return response.text()}).then(function(text){ return (new window.DOMParser()).parseFromString(text,"text/xml")})
        console.log(searchURL)
        //check if case exists set status error and message and return data
        //check if any values are not found set status error and message and return data
        //set status ok and return data
        _case = {
            status:"ok",
            case_title:$(data).find('sTitle').text(),
            case_id:case_id,
            case_url:'http://fogbugz.tcsgeeks.com/f/cases/'+case_id+'/',
            case_status:$(data).find('sStatus').text()
        }
        console.log(_case)
        return _case 
    }
}
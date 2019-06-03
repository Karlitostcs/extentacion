var fogqueue = {
    create:function(){
        var content = `
        <div id="fogqueue-container">

            <div class="fogqueue-title-container">
                <h2 class="fogqueue-title text-align-center">Fogqueue</h2>
            </div>
            <div class="fogqueue-message">
            </div>
            <form id="fogqueue-addcase" action="" >
                <input class="form-control" id="new_case_input" name="new_case_input" maxlength="9" required="true" placeholder="add new case...case id">
                <button id="new_case_button" type="submit">Add Case</button>
                    
            </form>
            <ul id="fogqueue"></ul>
        </div>
        `
        $('#main-wrap').before(content)
        $('#main').css({'width': '80%','float':'right'})
        this.queue.render()
        this.init_events()
    },
    init_events:function(){
       let  _this = this
        $('#fogqueue-addcase').submit(function(e){
            e.preventDefault()
            //check if input has a value of length more than 0
            _this.queue.add($('#new_case_input').val())
    
        })
        $('.fogqueue-removeItem').click(function(){
            let case_id = $(this).attr('data-case-id')
            _this.queue.remove(case_id)
        })
    },
    queue :{
        add: async function(caseid){
            var data = await fogbugz_api.getCaseById(caseid)
            if(data.status == 'ok'){
                content = `
                    <li data-case-id="${data.case_id}" class="fogqueue-item case" >
                        <a href="${data.case_url}">
                            <span class="fogqueue-caseid">${data.case_id}</span>
                            <span class="fogqueue-casestatus">${data.case_status}</span>
                        </a>
                        <button data-case-id="${data.case_id}" class="fogqueue-removeItem" >Remove</button>
                    </li>
                `
                let $queue= $('#fogqueue')

                if(fogdata.get_by_case_id(caseid).status!="ok"){
                    $queue.append(content)
                    delete data.status
                    fogdata.addNewCase(data)
                    $('#new_case_input').val('')
                }
                else{
                    fogqueue.messageBoard.setMessage(fogdata.get_by_case_id(caseid))
                }


            }
            else{
                fogqueue.messageBoard.setMessage(data)
            }
        },
        remove:async function(caseid){
            let $queue = $('#fogqueue')
            $queue.find('.case[data-case-id="'+caseid+'"]').remove()
            fogdata.removeCase(caseid)
        },
        render:function(){
            let cases = fogdata.get_all()
            if(cases.status == "ok"){
                for(let i=0;i<cases.data.length;i++){
                    let data = cases.data[i],
                    content = `
                    <li data-case-id="${data.case_id}" class="fogqueue-item case" >
                        <a href="${data.case_url}">
                            <span class="fogqueue-caseid">${data.case_id}</span>
                            <span class="fogqueue-casestatus">${data.case_status}</span>
                        </a>
                        <button data-case-id="${data.case_id}" class="fogqueue-removeItem" >Remove</button>
                    </li>
                `
                 $('#fogqueue').append(content)

                }
            }else{
                fogqueue.messageBoard.setMessage(cases)
            }
        },
        re_render:function(allcases){
            this.$queue.empty()
            for(let i = 0; i< allcases.length; i++){
                this.add(allcases[i])
            }
        }
    },
    messageBoard:{
        setMessage:function(mssge){
            if(mssge.status=="error"){
                $messageBoard = $('.fogqueue-message')
                $messageBoard.text(mssge.message)
                $messageBoard.css('display','block')
                setTimeout(function(){$messageBoard.css('display','none');$messageBoard.text('');console.log($messageBoard,mssge)},3500)
                
            }
        }
    }
}

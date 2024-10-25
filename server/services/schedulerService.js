'use strict';
var db = require('../db/db.js');
const msg91 = require("msg91")("268309AxaGdQSE5c90973d", "TGMODE", "4" );

class SchedulerService {
    constructor(){
      this.db=db;
    };

    async sendMorningMessage() {
        // var result = await this.db.query("select temp_attend_id,temp_driv_name,temp_dri_mob,temp_today_date,temp_dshift,start_loc_name,start_loc,reporting_time,concat('Please report at ',start_loc_name,' (',start_loc,'). Your first trip start time is: ',DATE_FORMAT(reporting_time,'%d-%M-%Y %H:%i:%s')) as msg from temp_driv_attnd_info" );       Commented by Vamsi on 23 July 2019
        var result = await this.db.query("select op_attn_dri_msg_det_id,op_attn_dri_msg_det_dname,op_attn_dri_msg_det_dmobile, concat('Dear ',op_attn_dri_msg_det_dname,', Your Duty Start Date is ', DATE_FORMAT(date(ADDTIME(SYSDATE(), '5:30')) ,'%d-%M-%Y ')) as msg from op_atten_driv_msg_det");       

        if(typeof(result) != undefined && Array.isArray(result) && result.length>0) {
          result.forEach(function(element) {
            console.log(element.op_attn_dri_msg_det_dmobile,element.msg);
            //console.log(msg91);
            
            msg91.send([element.op_attn_dri_msg_det_dmobile], element.msg, function(err, response){
              console.log(err);
              console.log(response);
              });
          });

        }

       /* */
        return 'Morning message sent successfully';
    };
}

module.exports = SchedulerService;
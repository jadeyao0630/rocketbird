import React, { useState } from 'react';
import axios from 'axios';

interface MyObject {
    [key: string]: any; // Index signature
  }
const selected_keys:MyObject={
    'flow_type':'流水类型',
    'flow_sn':'流水单号',
    'operate_type':'业务类型',
    'amount':'业务金额',
    'ci_name':'业务操作',
    'deal_time':'流水时间',
    'username':'会员姓名',
    'description':'业务描述',
    'card_name':'业务名称',
    'flow_category':'业务合同类型',
    'paid_amount':'支付金额',
    'paid_time':'支付时间',
    'pay_type_name':'支付类型',
    'serial_number':'支付单号'
}
function getOneYearAfterDate(dateString:string) {
    // Parse the input date string to a Date object
    const date = new Date(dateString);
    
    // Add one year to the date
    date.setFullYear(date.getFullYear() + 1);
    
    // Format the date to yyyy-MM-dd
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    
    // Return the formatted date string
    return `${year}-${month}-${day}`;
  }
function getToday(){
    const options:MyObject = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'Asia/Shanghai'
      };
      
      const formatter = new Intl.DateTimeFormat('zh-CN', options);
      
      const [{ value: year }, , { value: month }, , { value: day }] = formatter.formatToParts(new Date());
      
      return `${year}-${month}-${day}`;
}
function convertTimestampToChinaTime(timestamp:string) {
    // Convert timestamp to milliseconds
    const date = new Date(Number(timestamp) * 1000);
    
    // Create a formatter for China time zone
    const options:Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Shanghai',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      //second: '2-digit',
      hour12: false
    };
    const formatter = new Intl.DateTimeFormat('zh-CN', options);
    const [{ value: year }, , { value: month }, , { value: day }, , { value: hour }, , { value: min }] = formatter.formatToParts(date);
      
    return `${year}-${month}-${day} ${hour}:${min}`;
    //return `${year}-${month}-${day} ${hour}:${minute}`;
    //return formatter.format(date).replaceAll('/','-');
  }
const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('17710831560');
  const [password, setPassword] = useState('D/Lm4fqE+9IIUpj0VO/J9A==');
  const [startDate, setStartDate] = useState(getToday);
  const [endDate, setEndDate] = useState(getToday);
  const [results, setResults] = useState<Array<any>>([]);
  const [noRedeemSignIn, setNoRedeemSignIn] = useState(0);
  const [loginResults, setLoginResults] = useState<Array<any>>([]);
  const [recvResults, setRecvResults] = useState<Array<any>>([]);
  const [salesAmount,setSalesAmount] = useState(0)
  const [receivedAmount,setReceivedAmount] = useState(0)
  const [summary,setSummary] = useState({
    salesAmount:0,
    receivedAmount: 0,
  })
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/login', { username, password }, { withCredentials: true });
      console.log('Login successful', response);
    } catch (error) {
      console.error('Login error', error);
    }
  };
  const begin_date=startDate
  const end_date=endDate
  const bus_id=11536
  const handleReceives = async () => {
    var parma={
        search:'',
        begin_date:begin_date,
        end_date:end_date,
        page_no:'1',
        page_size:'0',
        type:'',
        pay_type:'',
        pay_status:'',
        related:'',
        bus_id:bus_id
    }
    try {
      const response = await axios.post('http://localhost:3001/api/receivedList', {parma}, { withCredentials: true });
      setResults(response.data.results.list);
    } catch (error) {
      console.error('Search error', error);
    }
  };
  const handleNoRedeemSignIn = async ()=>{
    try {
        const response_redeem = await axios.post('http://localhost:3001/api/redeem', {numberRedeem:noRedeemSignIn,redeemPrice:10,cardName:"散客入场10元",rule_id:"247014472294846464"}, { withCredentials: true });
        const response_signIn = await axios.post('http://localhost:3001/api/userSignIn', {numberSign:noRedeemSignIn,user_id:"33330211",card_user_id:"26124736"}, { withCredentials: true });
    }catch (error) {
        console.error('Search error', error);
    }
  }
  const handleSync = async () => {
    var parma={
        bus_id:bus_id,
        begin_date:begin_date,
        end_date:end_date,
        page_no:"1",
        page_size:"1",
        flow_type:"",
        pay_type:"",
        search:"",
        sale_id:"",
        operate_type:""
    }
    const response = await axios.post('http://localhost:3001/api/salesList', {parma}, { withCredentials: true });
    parma['page_size']=response.data.results.count
    const _response = await axios.post('http://localhost:3001/api/salesList', {parma}, { withCredentials: true });
    const list:Array<any>=_response.data.results.list as []
    var queries:Array<string>=[]
    list.forEach(async(item:MyObject) => {
      var _key:Array<string>=[]
      var _source_key:Array<string>=[]
      var _val:Array<string>=[]
      var _key_val:Array<string>=[]
      var _id_p=0;
      var _key_p:Array<string>=[]
      var _source_key_p:Array<string>=[]
      var _val_p:Array<string>=[]
      var _key_val_p:Array<string>=[]
      var _id_m=0;
      var _key_m:Array<string>=[]
      var _source_key_m:Array<string>=[]
      var _val_m:Array<string>=[]
      var _key_val_m:Array<string>=[]
      Object.keys(item).forEach(key=>{
          if(key==="pay_detail"){
              if(item[key]!=="[]"){
                  const pd=item[key] as [];
                  pd.forEach(_pd=>{
                      _key_p.push("id");
                      _source_key_p.push("Source.id");
                      _val_p.push(_id_p.toString())
                      _key_val_p.push(`Target.id = Source.id`)
                      _id_p++;
                      _key_p.push("flow_sn");
                      _source_key_p.push("Source.flow_sn");
                      _val_p.push("'"+item["flow_sn"]+"'")
                      _key_val_p.push(`Target.flow_sn = Source.flow_sn`)
                      Object.keys(_pd).forEach(_key=>{
                          _key_p.push(_key);
                          _source_key_p.push("Source."+_key);
                          _val_p.push(_pd[_key]===null?"NULL":"N'"+_pd[_key]+"'")
                          _key_val_p.push(`Target.${_key} = Source.${_key}`)
                      });
                  })
              }
          }else if(key==="marketers_detail"){
              //console.log(item[key]);
              if(item[key]!=="[]"){
                  const pd=item[key] as [];
                  pd.forEach(_pd=>{
                      _key_m.push("id");
                      _source_key_m.push("Source.id");
                      _val_m.push(_id_m.toString())
                      _key_val_m.push(`Target.id = Source.id`)
                      _id_m++;
                      _key_m.push("flow_sn");
                      _source_key_m.push("Source.flow_sn");
                      _val_m.push("'"+item["flow_sn"]+"'")
                      _key_val_m.push(`Target.flow_sn = Source.flow_sn`)
                      Object.keys(_pd).forEach(_key=>{
                          _key_m.push(_key==="percent"?"["+_key+"]":_key);
                          _source_key_m.push("Source.["+_key+"]");
                          _val_m.push(_pd[_key]===null?"NULL":"N'"+_pd[_key]+"'")
                          _key_val_m.push(`Target.[${_key}] = Source.[${_key}]`)
                      });
                  })
              }
          }
          else{
              _key.push(key);
              _source_key.push("Source."+key);
              _val.push(item[key]===null?"NULL":"N'"+item[key]+"'")
              _key_val.push(`Target.${key} = Source.${key}`)
          }
          
      })
      var query=`MERGE INTO FinancialFlow AS Target
      USING (VALUES (${_val.join()})) AS Source (${_key.join()})
      ON Target.flow_sn = Source.flow_sn
      WHEN MATCHED THEN
          UPDATE SET ${_key_val.join()}
      WHEN NOT MATCHED THEN
          INSERT (${_key.join()})
          VALUES (${_source_key.join()});
      MERGE INTO pay_detail AS Target
      USING (VALUES (${_val_p.join()})) AS Source (${_key_p.join()})
      ON Target.flow_sn = Source.flow_sn AND Target.id = Source.id
      WHEN MATCHED THEN
          UPDATE SET ${_key_val_p.join()}
      WHEN NOT MATCHED THEN
          INSERT (${_key_p.join()})
          VALUES (${_source_key_p.join()});
      ${_val_m.length>0?`MERGE INTO marketers_detail AS Target
      USING (VALUES (${_val_m.join()})) AS Source (${_key_m.join()})
      ON Target.flow_sn = Source.flow_sn AND Target.id = Source.id
      WHEN MATCHED THEN
          UPDATE SET ${_key_val_m.join()}
      WHEN NOT MATCHED THEN
          INSERT (${_key_m.join()})
          VALUES (${_source_key_m.join()});`:""}`
      queries.push(query)
    });
    var parma_recv={
        search:'',
        begin_date:begin_date,
        end_date:end_date,
        page_no:'1',
        page_size:'0',
        type:'',
        pay_type:'',
        pay_status:'',
        related:'',
        bus_id:bus_id
    }
    const response_recv = await axios.post('http://localhost:3001/api/receivedList', {parma:parma_recv}, { withCredentials: true });
    (response_recv.data.results.list as []).forEach(recved=>{
        var _key:Array<string>=[]
        var _source_key:Array<string>=[]
        var _val:Array<string>=[]
        var _key_val:Array<string>=[]
        
        
        
        var query_fn:Array<string>=[]
        Object.keys(recved).forEach(key=>{
            
            
            if(key==="deal_time" || key==="flow_sn"){
                
            }else{
                
                _key.push(key);
                _source_key.push("Source."+key);
                _val.push(recved[key]===null?"NULL":"N'"+recved[key]+"'")
                _key_val.push(`Target.${key} = Source.${key}`)
                
            }
        });
        var _id=0;
        ((recved["flow_sn"] as string).split(',')).forEach(fsn=>{
            var _key_fn:Array<string>=[]
            var _source_key_fn:Array<string>=[]
            var _val_fn:Array<string>=[]
            var _key_val_fn:Array<string>=[]
            _key_fn.push("id");
            _source_key_fn.push("Source.id");
            _val_fn.push(_id.toString())
            _key_val_fn.push(`Target.id = Source.id`)
            _key_fn.push("serial_number");
            _source_key_fn.push("Source.serial_number");
            _val_fn.push("'"+recved["serial_number"]+"'")
            _key_val_fn.push(`Target.serial_number = Source.serial_number`)
            _key_fn.push("flow_sn");
            _source_key_fn.push("Source.flow_sn");
            _val_fn.push("'"+fsn.toString()+"'")
            _key_val_fn.push(`Target.flow_sn = Source.flow_sn`)
            _key_fn.push("deal_time");
            _source_key_fn.push("Source.deal_time");
            _val_fn.push("'"+(recved["deal_time"] as[])[_id]+"'")
            _key_val_fn.push(`Target.deal_time = Source.deal_time`)
            var q=`MERGE INTO ReceiveLinked AS Target
                    USING (VALUES (${_val_fn.join()})) AS Source (${_key_fn.join()})
                    ON Target.serial_number = Source.serial_number and Target.id = Source.id
                    WHEN MATCHED THEN
                        UPDATE SET ${_key_val_fn.join()}
                    WHEN NOT MATCHED THEN
                        INSERT (${_key_fn.join()})
                        VALUES (${_source_key_fn.join()});`
            query_fn.push(q)
            _id++;
        })
        var query=`MERGE INTO ReceiveLogList AS Target
        USING (VALUES (${_val.join()})) AS Source (${_key.join()})
        ON Target.serial_number = Source.serial_number
        WHEN MATCHED THEN
            UPDATE SET ${_key_val.join()}
        WHEN NOT MATCHED THEN
            INSERT (${_key.join()})
            VALUES (${_source_key.join()});
        `
        
        queries.push(query)
        queries.push(...query_fn)
      })
      //console.log(queries)
      var parma_login={
        s_date:begin_date,
        e_date:end_date,
        search:'',
        number:'',
        class_id:0,
        card_id:0,
        page_size:0,
        page_no:1
    }
      const response_login = await axios.post('http://localhost:3001/api/signInLogs', {parma:parma_login}, { withCredentials: true });
      parma_login['page_size']=response_login.data.results.count
      const _response_login = await axios.post('http://localhost:3001/api/signInLogs', {parma:parma_login}, { withCredentials: true });
        //console.log(_response_login)
      //var _manualSignIn=0
      _response_login.data.results.sign_log_list.forEach((item:MyObject)=>{
        var _key:Array<string>=[]
        var _source_key:Array<string>=[]
        var _val:Array<string>=[]
        var _key_val:Array<string>=[]
        Object.keys(item).forEach(key=>{
            if(key==="brand_number_arr" || key==="remind"){
                    
            }else{
                _key.push(key);
                _source_key.push("Source."+key);
                if(key==="create_time"){
                    _val.push(item[key]===null?"NULL":"N'"+convertTimestampToChinaTime(item['create_time'])+"'")
                }else
                    _val.push(item[key]===null?"NULL":"N'"+item[key]+"'")
                _key_val.push(`Target.${key} = Source.${key}`)
            }
        })
        var query=`MERGE INTO pc_sign_log AS Target
        USING (VALUES (${_val.join()})) AS Source (${_key.join()})
        ON Target.id = Source.id
        WHEN MATCHED THEN
            UPDATE SET ${_key_val.join()}
        WHEN NOT MATCHED THEN
            INSERT (${_key.join()})
            VALUES (${_source_key.join()});
        `
        
        queries.push(query)
      })
      queries.forEach(async(query)=>{
        //console.log(query);
        const response_upsert_ = await axios.post('http://localhost:3001/saveData', {type:"mssql",query:query}, { withCredentials: true });
        console.log(response_upsert_);
      })
  }
  const handleSales = async () => {
    var parma={
        bus_id:bus_id,
        begin_date:begin_date,
        end_date:end_date,
        page_no:"1",
        page_size:"1",
        flow_type:"",
        pay_type:"",
        search:"",
        sale_id:"",
        operate_type:""
    }
    var parma_recv={
        search:'',
        begin_date:begin_date,
        end_date:end_date,
        page_no:'1',
        page_size:'0',
        type:'',
        pay_type:'',
        pay_status:'',
        related:'',
        bus_id:bus_id
    }
    var parma_login={
        s_date:begin_date,
        e_date:end_date,
        search:'中诚保捷思',
        number:'',
        class_id:0,
        card_id:0,
        page_size:0,
        page_no:1
    }
    try {
      const response_recv = await axios.post('http://localhost:3001/api/receivedList', {parma:parma_recv}, { withCredentials: true });
      const response_login = await axios.post('http://localhost:3001/api/signInLogs', {parma:parma_login}, { withCredentials: true });
      parma_login['page_size']=response_login.data.results.count
      const _response_login = await axios.post('http://localhost:3001/api/signInLogs', {parma:parma_login}, { withCredentials: true });
        console.log(_response_login)
      //var _manualSignIn=0
      var _manualSignInList:Array<any>=[]
      _response_login.data.results.sign_log_list.forEach((item:MyObject)=>{
        if(Number(item['status'])===0){
            //_manualSignIn+=Number(item['consumption_form'])
            item['create_time']=convertTimestampToChinaTime(item['create_time'])
            for(var i = 0; i< Number(item['consumption_form']);i++){
                _manualSignInList.push(item)
            }
            
        }
      })
      const response = await axios.post('http://localhost:3001/api/salesList', {parma}, { withCredentials: true });
      parma['page_size']=response.data.results.count
      const _response = await axios.post('http://localhost:3001/api/salesList', {parma}, { withCredentials: true });
      const list:Array<any>=_response.data.results.list as []
      var manualSignIn:Array<any>=[]
      var _response_recv:Array<any>=[]
      var salesA=0
      var receivedAmount=0
      var queries:Array<string>=[]
      list.forEach(async(item:MyObject) => {
        var _key:Array<string>=[]
        var _source_key:Array<string>=[]
        var _val:Array<string>=[]
        var _key_val:Array<string>=[]
        var _id_p=0;
        var _key_p:Array<string>=[]
        var _source_key_p:Array<string>=[]
        var _val_p:Array<string>=[]
        var _key_val_p:Array<string>=[]
        var _id_m=0;
        var _key_m:Array<string>=[]
        var _source_key_m:Array<string>=[]
        var _val_m:Array<string>=[]
        var _key_val_m:Array<string>=[]
        Object.keys(item).forEach(key=>{
            if(key==="pay_detail"){
                if(item[key]!=="[]"){
                    const pd=item[key] as [];
                    pd.forEach(_pd=>{
                        _key_p.push("id");
                        _source_key_p.push("Source.id");
                        _val_p.push(_id_p.toString())
                        _key_val_p.push(`Target.id = Source.id`)
                        _id_p++;
                        _key_p.push("flow_sn");
                        _source_key_p.push("Source.flow_sn");
                        _val_p.push("'"+item["flow_sn"]+"'")
                        _key_val_p.push(`Target.flow_sn = Source.flow_sn`)
                        Object.keys(_pd).forEach(_key=>{
                            _key_p.push(_key);
                            _source_key_p.push("Source."+_key);
                            _val_p.push(_pd[_key]===null?"NULL":"N'"+_pd[_key]+"'")
                            _key_val_p.push(`Target.${_key} = Source.${_key}`)
                        });
                    })
                }
            }else if(key==="marketers_detail"){
                console.log(item[key]);
                if(item[key]!=="[]"){
                    const pd=item[key] as [];
                    pd.forEach(_pd=>{
                        _key_m.push("id");
                        _source_key_m.push("Source.id");
                        _val_m.push(_id_m.toString())
                        _key_val_m.push(`Target.id = Source.id`)
                        _id_m++;
                        _key_m.push("flow_sn");
                        _source_key_m.push("Source.flow_sn");
                        _val_m.push("'"+item["flow_sn"]+"'")
                        _key_val_m.push(`Target.flow_sn = Source.flow_sn`)
                        Object.keys(_pd).forEach(_key=>{
                            _key_m.push(_key==="percent"?"["+_key+"]":_key);
                            _source_key_m.push("Source.["+_key+"]");
                            _val_m.push(_pd[_key]===null?"NULL":"N'"+_pd[_key]+"'")
                            _key_val_m.push(`Target.[${_key}] = Source.[${_key}]`)
                        });
                    })
                }
            }
            else{
                _key.push(key);
                _source_key.push("Source."+key);
                _val.push(item[key]===null?"NULL":"N'"+item[key]+"'")
                _key_val.push(`Target.${key} = Source.${key}`)
            }
            
        })
        var query=`MERGE INTO FinancialFlow AS Target
        USING (VALUES (${_val.join()})) AS Source (${_key.join()})
        ON Target.flow_sn = Source.flow_sn
        WHEN MATCHED THEN
            UPDATE SET ${_key_val.join()}
        WHEN NOT MATCHED THEN
            INSERT (${_key.join()})
            VALUES (${_source_key.join()});
        MERGE INTO pay_detail AS Target
        USING (VALUES (${_val_p.join()})) AS Source (${_key_p.join()})
        ON Target.flow_sn = Source.flow_sn AND Target.id = Source.id
        WHEN MATCHED THEN
            UPDATE SET ${_key_val_p.join()}
        WHEN NOT MATCHED THEN
            INSERT (${_key_p.join()})
            VALUES (${_source_key_p.join()});
        ${_val_m.length>0?`MERGE INTO marketers_detail AS Target
        USING (VALUES (${_val_m.join()})) AS Source (${_key_m.join()})
        ON Target.flow_sn = Source.flow_sn AND Target.id = Source.id
        WHEN MATCHED THEN
            UPDATE SET ${_key_val_m.join()}
        WHEN NOT MATCHED THEN
            INSERT (${_key_m.join()})
            VALUES (${_source_key_m.join()});`:""}`
        queries.push(query)
        //console.log(query)
        
        
        var matched=(response_recv.data.results.list as []).find(item_recv=>{
            var included=(item_recv['flow_sn'] as string).split(',').includes(item['flow_sn'])
            if(included && !_response_recv.includes(item_recv)) _response_recv.push(item_recv)
            return included
        })
        
        item['paid_amount']= ''
        item['paid_time']=''
        item['pay_type_name']=''
        item['serial_number']=''
        if(item['flow_type']==='收入') salesA+=parseFloat(item['amount'])
        if(matched!== undefined){
            item['paid_amount']= (parseFloat(matched['amount'])/(matched['deal_time'] as []).length).toFixed(2)
            item['paid_time']= matched['create_time']
            item['pay_type_name']= matched['pay_type_name']
            item['serial_number']=matched['serial_number']
            receivedAmount+=(parseFloat(matched['amount'])/(matched['deal_time'] as []).length)
        }else{
            //console.log(getOneYearAfterDate(item['deal_time']))
            parma_recv['begin_date']=item['deal_time']
            parma_recv['end_date']=getOneYearAfterDate(item['deal_time'])
            axios.post('http://localhost:3001/api/receivedList', {parma:parma_recv}, { withCredentials: true }).then(res=>{
                
                const recv_list=res.data.results.list;
                if(recv_list!==undefined){
                    var _matched=(recv_list as []).find(recv_itm=>{
                        return (recv_itm['flow_sn'] as string).split(',').includes(item['flow_sn'])
                    })
                    item['paid_amount']= ''
                    item['paid_time']=''
                    item['pay_type_name']=''
                    item['serial_number']=''
                    if(_matched!== undefined){
                        item['paid_amount']= (parseFloat(_matched['amount'])/(_matched['deal_time'] as []).length).toFixed(2)
                        item['paid_time']= _matched['create_time']
                        item['pay_type_name']= _matched['pay_type_name']
                        item['serial_number']=_matched['serial_number']
                        receivedAmount+=(parseFloat(_matched['amount'])/(_matched['deal_time'] as []).length)
                    }
                }
                console.log(item)
            });
        }
        if (item['card_name']==='散客入场10元' || item['operate_type']==='票务'){
            if(parseFloat(item['amount'])>0){
                manualSignIn.push(item);
            }
           
        }
      });
      (response_recv.data.results.list as []).forEach(recved=>{
        Object.keys(recved).forEach(key=>{

        });
      })
      _response_recv=(response_recv.data.results.list as []).filter((item_recv)=>{
        return !_response_recv.includes(item_recv)
      })
      console.log(_manualSignInList.length,manualSignIn.length,_manualSignInList,manualSignIn,_response_recv);
      //setLoginResults({'signIn':_manualSignInList,'recv':manualSignIn})
      setLoginResults(_manualSignInList.sort((a:MyObject, b:MyObject) => {
            const dateA = new Date(a.create_time).getTime();
            const dateB = new Date(b.create_time).getTime();
            return dateA - dateB
        }));
      setRecvResults(manualSignIn.sort((a:MyObject, b:MyObject) => {
            const dateA = new Date(a.deal_time).getTime();
            const dateB = new Date(b.deal_time).getTime();
            return dateA - dateB
        }));
      var count=[]
      if(_response_recv.length>0){
        
        _response_recv.forEach(async (recv) =>{
            parma['search']=recv['flow_sn']
            parma['begin_date']='2024-06-01'
            const response_recv_ = await axios.post('http://localhost:3001/api/salesList', {parma}, { withCredentials: true });
            if(response_recv_.data.results.list!==undefined){
                
                const _list=response_recv_.data.results.list as Array<any>
                if(_list.length>0){
                    
                    const item=_list[0]
                    item['paid_amount']= (parseFloat(recv['amount'])/(recv['deal_time'] as []).length).toFixed(2)
                    item['paid_time']= recv['create_time']
                    item['pay_type_name']= recv['pay_type_name']
                    item['serial_number']=recv['serial_number']
                    list.push(item)
                    if(item['flow_type']==='收入') salesA+=parseFloat(item['amount'])
                    receivedAmount+=(parseFloat(recv['amount'])/(recv['deal_time'] as []).length)
                    console.log(parma,item);
                }
            }
            count.push(true)
        })
        
      }
      const intervalId = setInterval(() => {
        console.log('This message is displayed every 2 seconds',_response_recv.length,count.length);
        if(count.length===_response_recv.length){
            clearInterval(intervalId);
            //console.log(queries.join(""));
            // queries.forEach(async(query)=>{
            //     const response_upsert_ = await axios.post('http://localhost:3001/saveData', {type:"mssql",query:query}, { withCredentials: true });
            //     console.log(response_upsert_);
            // })
            
            setResults(list.sort((a:MyObject, b:MyObject) => {
                const dateA = new Date(a.deal_time).getTime();
                const dateB = new Date(b.deal_time).getTime();
                return dateA - dateB
            }));
            setSalesAmount(salesA)
            setReceivedAmount(receivedAmount)
        }
      }, 1000);
      
    } catch (error) {
      console.error('Search error', error);
    }
  };
  return (
    <div>
      <h1>登录</h1>
      <input type="text" placeholder="用户名" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="密码" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>登录</button>
      {/* <h1>散票打卡</h1>
      <input type="number" placeholder="散票打卡" value={noRedeemSignIn} onChange={(e) => setNoRedeemSignIn(Number(e.target.value))} />
      <button onClick={handleNoRedeemSignIn}>购买并打卡</button> */}
      <h1>销售与收入</h1>
      <input type="date" style={{marginRight:5}} placeholder="开始日期" value={startDate} onChange={(e) => setStartDate(e.target.value)} />-
      <input type="date" style={{marginLeft:5}} placeholder="结束日期" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      <button onClick={handleSales}>查询</button>
      <button onClick={handleReceives}>收入</button>
      <button onClick={handleSync}>同步</button>
      <h2>报告</h2>
      <label>应收：{salesAmount}</label>
      <label>实收：{receivedAmount}</label>
      <table style={{borderCollapse: 'collapse'}}>
        <thead>
            <tr>
                <th key={'check'} style={{border: '1px solid #dddddd',padding: '12px 15px'}}></th>
            {
                results.length>0 && Object.keys(results[0]).map((key)=>(
                    Object.keys(selected_keys).includes(key)?
                    <th key={key} style={{border: '1px solid #dddddd',padding: '12px 15px'}}>
                        {selected_keys[key]}
                    </th>
                    :
                    null
                ))
            }
            </tr>
        </thead>
        <tbody>
        {results.length>0 && results.map((result, index) => (
          <tr key={index} >
            <td key={'check'+index} style={{border: '1px solid #dddddd',padding: '12px 15px'}}>
                <input type="checkbox" checked={parseFloat(result['amount'])===parseFloat(result['paid_amount']) || parseFloat(result['amount'])===0} readOnly></input>
            </td>
            {Object.keys(result).map((key)=>(
                
                Object.keys(selected_keys).includes(key)?
                (key==='pay_detail'||key==='marketers_detail') && (result[key] as Array<any>).length>0 ?
                (result[key] as Array<any>).map((r,i)=>(
                    <td key={i} style={{border: '1px solid #dddddd',padding: '12px 15px'}}>
                    {Object.keys(r).map((k)=>(
                        <div key={k}>
                            {k+": "+r[k]}
                        </div>
                    ))}
                    </td>
                ))
                :(
                    
                    <td key={key} style={{border: '1px solid #dddddd',padding: '12px 15px'}}>
                        {key==='paid_time' && Array.isArray(result[key])?(result[key] as []).join(','):result[key]}
                    </td>
                )
                :null
            ))
            }
          </tr>
        ))}
        </tbody>
      </table>
      <h2>(中诚保捷思) 打卡分析</h2>
      <div style={{display:'inline-grid',gridTemplateColumns:'auto auto'}}>
      <table style={{borderCollapse: 'collapse',display:'inline'}}>
        <thead>
            <tr>
                <th style={{border: '1px solid #dddddd',padding: '12px 15px'}}>{'支付时间'}</th>
            </tr>
        </thead>
        <tbody>
        
            {recvResults.map((item:MyObject,i)=>(
                <tr key={i}>
                    <td key={'td'+i} style={{border: '1px solid #dddddd',padding: '12px 15px'}}>{item.hasOwnProperty('create_time')?item['create_time']:item['deal_time']}</td>
                </tr>
                
            ))}
        </tbody>
      </table>
      <table style={{borderCollapse: 'collapse',display:'inline'}}>
        <thead>
            <tr>
                <th style={{border: '1px solid #dddddd',padding: '12px 15px'}}>{'打卡时间'}</th>
            </tr>
        </thead>
        <tbody>
            {loginResults.map((item:MyObject,i)=>(
                <tr key={i}>
                    <td key={'td'+i} style={{border: '1px solid #dddddd',padding: '12px 15px'}}>{item.hasOwnProperty('create_time')?item['create_time']:item['deal_time']}</td>
                </tr>
                
            ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default LoginForm;


//https://wx.rocketbird.cn/Web/statistics/ReceiveLogList
	
// search	""
// begin_date	"2024-06-18"
// end_date	"2024-06-18"
// page_no	"1"
// page_size	"10"
// type	""
// pay_type	""
// pay_status	""
// related	""
// bus_id	"11536"

// serial_number	"2024061821365400001"
// create_time	"2024-06-18 21:36"
// deal_time	[ "2024-06-18", "2024-06-18", "2024-06-18" ]
// amount	"+30.00"
// pay_type	"19"
// id	"16142576"
// type	"0"
// is_online	"0"
// username	"散客"
// user_id	"-1"
// order_no	""
// flow_sn	"24061822O00065,24061822O00066,24061822O00067"
// pay_type_name	"转账"
// bus_id	"11536"
// bus_name	"健豪运动"
// is_real_user	false

// IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ReceiveLogList' AND xtype='U')
// BEGIN
//     CREATE TABLE ReceiveLogList (
//         serial_number NVARCHAR(255) PRIMARY KEY,
//         create_time DATETIME,
//         amount MONEY,
//         pay_type INT,
//         id INT,
//         type INT,
//         is_online BIT,
//         username NVARCHAR(1000),
//         user_id INT,
//         order_no NVARCHAR(1000),
//         pay_type_name NVARCHAR(255),
//         bus_id INT,
//         bus_name NVARCHAR(255),
//         is_real_user BIT,
//     )
// END
// IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ReceiveLinked' AND xtype='U')
// BEGIN
//     CREATE TABLE ReceiveLinked (
//         serial_number NVARCHAR(255),
//         id INT,
//         deal_time DATETIME,
//         flow_sn NVARCHAR(1000),
//         PRIMARY KEY (serial_number, id)
//     )
// END

//https://wx.rocketbird.cn/Web/statistics/getFinancialFlowNew

// bus_id	"11536"
// begin_date	"2024-06-18"
// end_date	"2024-06-18"
// flow_type	""
// pay_type	""
// search	""
// sale_id	""
// operate_type	""
// page_size	"10"
// page_no	"1"





// bus_id	"11536"
// flow_type	"收入"
// flow_sn	"24061822O00067"
// remark	""
// serv_id	"249286839774806016"
// operate_type	"票务"
// amount	"10.00"
// pre_payment	"0.00"
// income_amount	"10.00"
// pay_type_amount	"10.00"
// pay_type_id	"19"
// debt_bus_id	null
// ci_bus_id	null
// ci_id	null
// card_id	null
// ci_name	""
// card_type_id	null
// id	"29492904"
// serv_type	"7"
// deal_time	"2024-06-18 21:36"
// user_id	"-1"
// username	"散客"
// description	"散客入场10元"
// card_name	"散客入场10元"
// custom_order_sn	""
// lr_id	""
// flow_category	"会籍合同"
// is_real_user	false
// marketers_detail	[]
// pay_detail	[ {…} ]
// bus_name	"健豪运动"

// IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'rocketBird')
// BEGIN
//     CREATE DATABASE rocketBird
// END

// IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ReceiveLogList' AND xtype='U')
// BEGIN
//     CREATE TABLE ReceiveLogList (
//         serial_number NVARCHAR(255) PRIMARY KEY,
//         create_time DATETIME,
//         amount MONEY,
//         pay_type INT,
//         id INT,
//         type INT,
//         is_online BIT,
//         username NVARCHAR(1000),
//         user_id INT,
//         order_no NVARCHAR(1000),
//         pay_type_name NVARCHAR(255),
//         bus_id INT,
//         bus_name NVARCHAR(255),
//         is_real_user BIT,
//     )
// END
// IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ReceiveLinked' AND xtype='U')
// BEGIN
//     CREATE TABLE ReceiveLinked (
//         serial_number NVARCHAR(255),
//         id INT,
//         deal_time DATETIME,
//         flow_sn NVARCHAR(1000),
//         PRIMARY KEY (serial_number, id)
//     )
// END

// IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='FinancialFlow' AND xtype='U')
// BEGIN
//     CREATE TABLE FinancialFlow (
//         bus_id INT,
//         flow_type NVARCHAR(255),
//         flow_sn NVARCHAR(255) PRIMARY KEY,
//         remark NVARCHAR(1000),
//         serv_id NVARCHAR(255),
//         operate_type NVARCHAR(255),
//         amount MONEY,
//         pre_payment MONEY,
//         income_amount MONEY,
//         pay_type_amount MONEY,
//         pay_type_id INT,
//         debt_bus_id VARCHAR(50) NULL,
//         ci_bus_id VARCHAR(50) NULL,
//         ci_id VARCHAR(50) NULL,
//         card_id VARCHAR(50) NULL,
//         ci_name NVARCHAR(255),
//         card_type_id INT,
//         id INT,
//         serv_type INT,
//         deal_time DATETIME,
//         user_id INT,
//         username NVARCHAR(255),
//         description NVARCHAR(1000),
//         card_name NVARCHAR(1000),
//         custom_order_sn NVARCHAR(255),
//         lr_id INT,
//         flow_category NVARCHAR(255),
//         is_real_user BIT,
//         bus_name NVARCHAR(255),
//     )
// END

// IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='pay_detail' AND xtype='U')
// BEGIN
//     CREATE TABLE pay_detail (
//         flow_sn NVARCHAR(255) NOT NULL,
//         id INT NOT NULL,
//         pay_type NVARCHAR(255),
//         amount MONEY,
//         pay_type_id INT,
//         PRIMARY KEY (flow_sn, id)
//     )
// END
// IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='marketers_detail' AND xtype='U')
// BEGIN
//     CREATE TABLE marketers_detail (
//         flow_sn NVARCHAR(255) NOT NULL,
//         id INT NOT NULL,
//         name NVARCHAR(255),
//         role NVARCHAR(255),
//         "percent" NVARCHAR(255),
//         amount MONEY,
//         PRIMARY KEY (flow_sn, id)
//     )
// END

// IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='pc_sign_log' AND xtype='U')
// BEGIN
//     CREATE TABLE pc_sign_log (
//         id	INT PRIMARY KEY,
//         bus_id	NVARCHAR(255),
//         user_id	NVARCHAR(255),
//         marketers_id INT,
//         card_name NVARCHAR(255),
//         card_user_id NVARCHAR(255),
//         card_type INT,
//         sign_number INT,
//         type INT,
//         status BIT,
//         brand_number NVARCHAR(255),
//         add_time NVARCHAR(255),
//         return_brand_number	NVARCHAR(255),
//         return_time	NVARCHAR(255),
//         class_id INT,
//         class_category INT,
//         class_mark_id INT,
//         class_user_id INT,
//         coach_id INT,
//         coach_name NVARCHAR(255),
//         consumption_form INT,
//         consumption_form_balance MONEY,
//         create_time	NVARCHAR(255),
//         end_train BIT,
//         end_time NVARCHAR(255),
//         end_type INT,
//         is_miss	BIT,
//         miss_status	INT,
//         old_user_id	NVARCHAR(255),
//         is_import BIT,
//         phone NVARCHAR(255),
//         nickname NVARCHAR(255),
//         username NVARCHAR(255),
//         avatar	NVARCHAR(1000),
//         sex	INT,
//         RFID_id	NVARCHAR(1000),
//         add_way	INT,
//         card_sn	NVARCHAR(1000),
//         class_name NVARCHAR(1000),
//         card_type_id INT,
//         is_pt_time_limit_card BIT,
//         order_sn NVARCHAR(1000),
//         brand_number_count INT,
//         consumption NVARCHAR(1000)
//     )
// END

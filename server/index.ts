import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const PORT = 3001;
interface MyObject {
    [key: string]: any; // Index signature
  }
app.use(cors({
    origin: 'http://localhost:3000', // 设置允许的源，假设前端在端口3000上运行
    credentials: true, // 允许携带cookie
  }));
app.use(bodyParser.json());
app.use(cookieParser());
import DbService from './dbService';
const db= DbService.getDbServiceInstance();

app.post('/getData',async(request,response) => {
    //console.log('request----',request);
    const {type="mssql",query="select * from p_Room"} = request.body;
    
    try {
        if(type==="mssql"){
            const result = await db.mssqlGet(query)
            response.json({data:result})
        }else{
            db.mysqlGet(query).then((res:any)=>{
                if(!res.success) console.log(res)
            });
        }
        
        //response.json({data:type,query:query})
    }catch(err:any){
        console.error('Database polling error:', err);
        response.json({data:err})
    }

});
app.post('/saveData',async(request,response) => {
    //console.log('request----',request);
    const {type="mssql",query="select * from p_Room"} = request.body;
    
    try {
        if(type==="mssql"){
            const result = await db.mssqlExcute(query)
            response.json({data:result})
        }else{
            db.mysqlExcute(query).then((res:any)=>{
                if(!res.success) console.log(res)
            });
        }
        
        //response.json({data:type,query:query})
    }catch(err:any){
        console.error('Database polling error:', err);
        response.json({data:err})
    }

});
app.post('/api/login', async (req, res) => {
  const { username, password,vcode } = req.body;
  try {
    const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('vCode', vcode);

      // 发送 POST 请求
      const response = await axios.post(
        'https://wx.rocketbird.cn/Web/Public/check_login',
        formData,
        {
          withCredentials: true, // 允许携带跨域请求的cookie
        }
      );
      const cookies = response.headers['set-cookie'];
      if (cookies) {
        (cookies).forEach((cookie: string) => {
          const [cookieName, ...cookieValue] = cookie.split(';')[0].split('=');
          if(cookieName==='sscode'){
            if(cookieValue.join('=')!=='0'){
                res.cookie(cookieName, cookieValue.join('='), { 
                    httpOnly: false,
                    secure: false, // 确保只通过 HTTPS 传递
                  });
                  console.log(cookieName, cookieValue.join('='));
            }
          }else{
            if(cookieName!=='error_number'){
                res.cookie(cookieName, cookieValue.join('='), { 
                    httpOnly: cookieName==='acw_tc',
                    secure: false, // 确保只通过 HTTPS 传递
                  });
                  console.log(cookieName, cookieValue.join('='));
            }
            
          }
          
          
        });
        //res.setHeader('Set-Cookie', cookies);
      }
      
      console.log('Login successful', cookies);
    res.status(200).send(cookies);
  } catch (error) {
    res.status(500).send('Login error');
  }
});

app.post('/api/receivedList', async (req, res) => {
  const { parma } = req.body;
  delete req.cookies['supabase-auth-token']
  //const cookies = 'acw_tc=2f6a1fc117182929183243752e0fa877cf519693ea219f3117699c55b38e30;PHPSESSID=57894a1cf5dcff033ee39dacbf589efe;sscode=yKvdTQiO4Tpwi8wnAP49j2k3B3Me3QTiyK%2BcNEdoAycZJjDgQNDXwGvDZhXXEO8;token=pc_saas'
  try {
    const formData = new FormData();

    Object.keys(parma).forEach(key => {
      const value = parma[key];
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          formData.append(`${key}[${index}]`, item);
        });
      } else {
        formData.append(key, value);
      }
    });

    const cookieString = Object.entries(req.cookies)
      .map(([key, value]) => `${key}=${value}`)
      .join('; ');

    const searchResponse = await axios.post('https://wx.rocketbird.cn/Web/statistics/ReceiveLogList', formData, {
      withCredentials: false,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Cookie': cookieString
      }
    });

    console.log(searchResponse.data.data);
    res.status(200).json({ results: searchResponse.data.data });
  } catch (error) {
    res.status(500).send('Search error');
  }
});

app.post('/api/salesList', async (req, res) => {
    const { parma } = req.body;
    delete req.cookies['supabase-auth-token']
    //const cookies = 'acw_tc=2f6a1fc117182929183243752e0fa877cf519693ea219f3117699c55b38e30;PHPSESSID=57894a1cf5dcff033ee39dacbf589efe;sscode=yKvdTQiO4Tpwi8wnAP49j2k3B3Me3QTiyK%2BcNEdoAycZJjDgQNDXwGvDZhXXEO8;token=pc_saas'
    try {
      const formData = new FormData();
  
      Object.keys(parma).forEach(key => {
        const value = parma[key];
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else {
          formData.append(key, value);
        }
      });
  
      const cookieString = Object.entries(req.cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ');
  
      const searchResponse = await axios.post('https://wx.rocketbird.cn/Web/statistics/getFinancialFlowNew', formData, {
        withCredentials: false,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Cookie': cookieString
        }
      });
  
      console.log(searchResponse.data.data);
      res.status(200).json({ results: searchResponse.data.data });
    } catch (error) {
      res.status(500).send('Search error');
    }
  });

app.post('/api/signInLogs', async (req, res) => {
    const { parma } = req.body;
    delete req.cookies['supabase-auth-token']
    //const cookies = 'acw_tc=2f6a1fc117182929183243752e0fa877cf519693ea219f3117699c55b38e30;PHPSESSID=57894a1cf5dcff033ee39dacbf589efe;sscode=yKvdTQiO4Tpwi8wnAP49j2k3B3Me3QTiyK%2BcNEdoAycZJjDgQNDXwGvDZhXXEO8;token=pc_saas'
    try {
      const formData = new FormData();
  
      Object.keys(parma).forEach(key => {
        const value = parma[key];
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else {
          formData.append(key, value);
        }
      });
  
      const cookieString = Object.entries(req.cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ');
  
      const searchResponse = await axios.post('https://wx.rocketbird.cn/Web/Sign/pc_sign_log', formData, {
        withCredentials: false,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Cookie': cookieString
        }
      });
  
      console.log(searchResponse.data.data);
      res.status(200).json({ results: searchResponse.data.data });
    } catch (error) {
      res.status(500).send('Search error');
    }
  });
  app.post('/api/userSignIn', async (req, res) => {
    
    const { numberSign,user_id,card_user_id } = req.body;
    const p:MyObject={
        user_id:	user_id?user_id:"33330211",//"33063199",//33330211
        card_user_id:	card_user_id?card_user_id:"26124736",//"25825794",//26124736
        sign_number:	"1",
        consumption_form:	numberSign,
        is_print_ticket:	"1",
    }
    delete req.cookies['supabase-auth-token']
    //const cookies = 'acw_tc=2f6a1fc117182929183243752e0fa877cf519693ea219f3117699c55b38e30;PHPSESSID=57894a1cf5dcff033ee39dacbf589efe;sscode=yKvdTQiO4Tpwi8wnAP49j2k3B3Me3QTiyK%2BcNEdoAycZJjDgQNDXwGvDZhXXEO8;token=pc_saas'
    try {
      const formData = new FormData();
  
      Object.keys(p).forEach(key => {
        const value = p[key];
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else {
          formData.append(key, value);
        }
      });
  
      const cookieString = Object.entries(req.cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ');
  
      const searchResponse = await axios.post('https://wx.rocketbird.cn/Web/Sign/user_sign', formData, {
        withCredentials: false,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Cookie': cookieString
        }
      });
  
      console.log(formData,searchResponse.data);
      res.status(200).json({ results: searchResponse.data });
    } catch (error) {
      res.status(500).send('Search error');
    }
  });
  

app.post('/api/redeem', async (req, res) => {
    //const redeemPrice=0;
    const { numberRedeem,redeemPrice,cardName,rule_id } = req.body;
    var amount=0;
    const _redeemPrice=redeemPrice?redeemPrice:0
    var _redeem_parma:MyObject = {}
    for(var i=0;i<numberRedeem;i++){
        amount+=_redeemPrice
        
        _redeem_parma[`san_batch_list[${i}][card_name]`]=cardName?cardName:"散客入场10元"
        _redeem_parma[`san_batch_list[${i}][san_rule_id]`]=rule_id?rule_id:"247014472294846464"
        _redeem_parma[`san_batch_list[${i}][pre_amount]`]="0"
        _redeem_parma[`san_batch_list[${i}][user_id]`]=""
        _redeem_parma[`san_batch_list[${i}][phone]`]=""
        _redeem_parma[`san_batch_list[${i}][username]`]=""
        _redeem_parma[`san_batch_list[${i}][enter_card_number]`]=""
    }
    _redeem_parma['amount']=amount
    _redeem_parma['deposit_unit_price']=amount

    delete req.cookies['supabase-auth-token']
    //const cookies = 'acw_tc=2f6a1fc117182929183243752e0fa877cf519693ea219f3117699c55b38e30;PHPSESSID=57894a1cf5dcff033ee39dacbf589efe;sscode=yKvdTQiO4Tpwi8wnAP49j2k3B3Me3QTiyK%2BcNEdoAycZJjDgQNDXwGvDZhXXEO8;token=pc_saas'
    try {
      const formData = new FormData();
  
      Object.keys(_redeem_parma).forEach(key => {
        const value = _redeem_parma[key];
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else {
          formData.append(key, value);
        }
      });
  
      const cookieString = Object.entries(req.cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ');
  
      const searchResponse = await axios.post('https://wx.rocketbird.cn/Web/San/buyBatch', formData, {
        withCredentials: false,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Cookie': cookieString
        }
      });
  
      console.log(_redeem_parma,searchResponse.data);
      res.status(200).json({ results: searchResponse.data });
    } catch (error) {
      res.status(500).send('Search error');
    }
  });
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
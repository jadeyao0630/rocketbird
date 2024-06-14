import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const PORT = 3001;
app.use(cors({
    origin: 'http://localhost:3000', // 设置允许的源，假设前端在端口3000上运行
    credentials: true, // 允许携带cookie
  }));
app.use(bodyParser.json());
app.use(cookieParser());

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
        res.setHeader('Set-Cookie', cookies);
      }
      
      console.log('Login successful', cookies);
    res.status(200).send(cookies);
  } catch (error) {
    res.status(500).send('Login error');
  }
});

app.post('/api/search', async (req, res) => {
  const { parma ,cookies} = req.body;
  //const cookies = 'acw_tc=2f6a1fc117182929183243752e0fa877cf519693ea219f3117699c55b38e30;PHPSESSID=57894a1cf5dcff033ee39dacbf589efe;sscode=yKvdTQiO4Tpwi8wnAP49j2k3B3Me3QTiyK%2BcNEdoAycZJjDgQNDXwGvDZhXXEO8;token=pc_saas'
  try {
    const searchResponse = await axios.post('https://wx.rocketbird.cn/Web/statistics/ReceiveLogList', parma, {
        withCredentials: true,
      headers: {
        Cookie: cookies
      }
    });
    console.log(req.headers,cookies,parma,searchResponse.data)
    res.status(200).json({ results: searchResponse.data.results });
  } catch (error) {
    res.status(500).send('Search error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
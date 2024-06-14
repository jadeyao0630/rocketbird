import React, { useState } from 'react';
import axios from 'axios';
interface MyObject {
    [key: string]: string; // Index signature
  }
const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('17710831560');
  const [password, setPassword] = useState('D/Lm4fqE+9IIUpj0VO/J9A==');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
    var _cookies:string[]=[];
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/login', { username, password }, { withCredentials: false });
      console.log('Login successful', response);
      if (response) {
        (response.data as string[]).forEach((cookie: string) => {
          const [cookieName, ...cookieValue] = cookie.split(';')[0].split('=');
          if(cookieName==='sscode'){
            if(cookieValue.join('=')!=='0'){
                // res.cookie(cookieName, cookieValue.join('='), { 
                //     httpOnly: false,
                //     secure: false, // 确保只通过 HTTPS 传递
                //   });
                  console.log(cookieName, cookieValue.join('='));
                  _cookies.push(cookieName+"="+cookieValue.join('='));
            }
          }else{
            if(cookieName!=='error_number'){
                // res.cookie(cookieName, cookieValue.join('='), { 
                //     httpOnly: cookieName==='acw_tc',
                //     secure: false, // 确保只通过 HTTPS 传递
                //   });
                  console.log(cookieName, cookieValue.join('='));
                  _cookies.push(cookieName+"="+cookieValue.join('='));
            }
            
          }
          
          //_cookies=response.data
        });
        //res.setHeader('Set-Cookie', cookies);
      }
    } catch (error) {
      console.error('Login error', error);
    }
  };

  const handleSearch = async () => {
    
    var parma={
        search:'',
        begin_date:'2024-06-1',
        end_date:'2024-06-13',
        page_no:'1',
        page_size:'0',
        type:'',
        pay_type:'',
        pay_status:'',
        related:'',
        bus_id:'11536'
    }
    var cookies=_cookies.join('; ');
    try {
      const response = await axios.post('http://localhost:3001/api/search', {parma,cookies}, { withCredentials: true });
      setResults(response.data.results);
    } catch (error) {
      console.error('Search error', error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      
      <h1>Search</h1>
      <input type="text" placeholder="Search query" value={query} onChange={(e) => setQuery(e.target.value)} />
      <button onClick={handleSearch}>Search</button>

      <h2>Results</h2>
      <ul>
        {results.map((result, index) => (
          <li key={index}>{result}</li>
        ))}
      </ul>
    </div>
  );
};

export default LoginForm;
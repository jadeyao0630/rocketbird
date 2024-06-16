var mssql=require("mssql");
import * as dotenv from 'dotenv';
import * as path from 'path';
const { env } = process;
dotenv.config({
    path: path.resolve(
        __dirname,
        `./.env${process.env.NODE_ENV ? "."+process.env.NODE_ENV : ""}`
      ),
});
const mssqlConfig = {
    user: env.MS_USER,
    password: env.MS_PASSWORD,
    server: env.MS_HOST,
    database: env.MS_DATABASE,
    options: {
        encrypt: false,
      //encrypt: true, // for azure
      //trustServerCertificate: true // for self-signed certificates
    }
  };
  let pool = new mssql.ConnectionPool(mssqlConfig);
  var query=function(sql:string,callback:Function){
    console.log('mssqlQuery',sql)
    pool.connect().then(()=>{
        pool.request().query(sql,function(err:object|undefined,results:object){
            console.log('mssqlQuery',err,results)
            callback?.(err,results);
            pool.close();
        })
    });
    
    
  }
  module.exports=query;
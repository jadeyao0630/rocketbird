const mysqlQuery = require('./mMysql.ts');
const mssqlQuery = require('./mMssql.ts');
let instance:DbService;

export default class DbService{
    static getDbServiceInstance(){
        return instance ? instance : new DbService();
    }
    async mssqlGet(query:string){
        try{
            //const LAST_VERSION_QUERY='SELECT * FROM sync_version WHERE table_name = "'+table+'"';
            const response = await new Promise(async(resolve,reject)=>{
                mssqlQuery(query, (err:object,results:object)=>{
                    if (err) resolve ({
                        success:false,
                        data:err,
                        query:query,
                    })
                    resolve({
                        success:true,
                        data:results
                    });
                });
            })
            return response
        }catch(error){
            console.log(error);
            return {
                success:false,
                data:error,
                query:query,
            }
        }
    }
    async mysqlGet(query:string){
        try{
            //const LAST_VERSION_QUERY='SELECT * FROM sync_version WHERE table_name = "'+table+'"';
            const response = await new Promise(async(resolve,reject)=>{
                mysqlQuery(query, (err:object,results:object)=>{
                    if (err) resolve ({
                        success:false,
                        data:err,
                        query:query,
                    })
                    resolve({
                        success:true,
                        data:results
                    });
                });
            })
            return response
        }catch(error){
            console.log(error);
            return {
                success:false,
                data:error,
                query:query,
            }
        }
    }
    async mysqlExcute(query:string){
        try{
            const response = await new Promise(async(resolve,reject)=>{
                mysqlQuery(query, (err:object,results:object)=>{
                    if (err) resolve ({
                        success:false,
                        data:err,
                        query:query,
                    })
                    resolve({
                        success:true,
                        data:results
                    });
                });
            })
            return response
        }catch(error){
            console.log(error);
            return {
                'success':false,
                'data':error
            }
        }
    }
    async mssqlExcute(query:string){
        try{
            const response = await new Promise(async(resolve,reject)=>{
                mssqlQuery(query, (err:object,results:object)=>{
                    if (err) resolve ({
                        success:false,
                        data:err,
                        query:query,
                    })
                    //console.log('results',results)
                    resolve({
                        success:true,
                        data:results
                    });
                });
            })
            return response
        }catch(error){
            console.log(error);
            return {
                'success':false,
                'data':error,
                query:query,
            }
        }
    }
}
module.exports = DbService;
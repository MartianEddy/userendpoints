
import express from 'express'
import router from './Routes/userroute'
const app= express()
 app.use(express.json())
app.use('/user',router)
 app.listen(7000, ()=>{
     console.log('App running on part 7000 ...');
     
 })

//  const checkConnection=async ()=>{
//     await mssql.connect(sqlConfig).then(
//         x=>{
//            if( x.connected){
//                console.log('Database Connected');
               
//            }
//         }
//     ).catch(err=>{
//         console.log(err.message);
//     })
//     }
    
    
//     const checkConnection=async ()=>{
//         try {
//             const x =await mssql.connect(sqlConfig)
//             if( x.connected){
//                  console.log('Database Connected');
//              }
//          } 
//          catch (error:any) {
//             console.log(error.message);
//         }
//     }
    
//     checkConnection()
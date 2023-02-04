let express=require("express");
const { Client } = require("pg");
let app=express()
app.use(express.json())
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*")
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"

    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With ,Content-Type, Accept"

    );
    next();

   
});
const client=new Client({
    user:"postgres",
    password:"iltutmish@2022",
    database:"postgres",
    port:5432,
    host:"db.flfurqnvbdlcuhsyrwoz.supabase.co",
    ssl:{rejectUnauthorized:false}
})
client.connect(function(res,err){
    console.log('connect ot superbase data base')
})
//const port=2410
var port= process.env.PORT || 2410;
app.listen(port,()=>console.log(`Node app is listinng${port}`))

app.get('/svr/mobiles',function(req,res){

     let {ram,rom,brand}=req.query
     let arr1;
     let arr2;
     let arr3;
     if(ram){
        arr1=ram.split(',')
     }
     if(rom){
        arr2=rom.split(',')
     }
    if(brand){
        arr3=brand.split(',')
    }
    let sql='select * from mobiles'
    client.query(sql,function(err,result){
        if(err){
            console.log(err);
            res.status(404).send(err)
        }
        else{
            let newarr=ram?result.rows.filter(elem=>arr1.find(val=>val==elem.ram)):result.rows
            newarr=rom?newarr.filter(elem=>arr2.find(val=>val==elem.rom)):newarr
            newarr=brand?newarr.filter(elem=>arr3.find(val=>val==elem.brand)):newarr
            
          
            
            
            res.send(newarr);
           
        }
    })
})
app.get('/svr/mobiles/brand/:brand',function(req,res){
    let {brand}=req.params
    let sql='select * from mobiles where brand=$1'
    client.query(sql,[brand],function(err,result){
        if(err){
            console.log(err);
            res.status(404).send(err)
        }
        else{
            res.send(result.rows);
        }
    })
})
app.get('/svr/mobiles/ram/:ram',function(req,res){
    let {ram}=req.params
    let sql='select * from mobiles where ram=$1'
    client.query(sql,[ram],function(err,result){
        if(err){
            console.log(err);
            res.status(404).send(err)
        }
        else{
            res.send(result.rows);
        }
    })
})
app.get('/svr/mobiles/rom/:rom',function(req,res){
    let {rom}=req.params
    let sql='select * from mobiles where rom=$1'
    client.query(sql,[rom],function(err,result){
        if(err){
            console.log(err);
            res.status(404).send(err)
        }
        else{
            res.send(result.rows);
        }
    })
})
app.get('/svr/mobiles/os/:os',function(req,res){
    let {os}=req.params
    let sql='select * from mobiles where os=$1'
    client.query(sql,[os],function(err,result){
        if(err){
            console.log(err);
            res.status(404).send(err)
        }
        else{
            res.send(result.rows);
        }
    })
})
app.post('/svr/mobiles',function(req,res){
     let {body}=req
     let arr=Object.values(body)
    let sql='insert into mobiles(name,price,brand,ram,rom,os) values($1,$2,$3,$4,$5,$6)'
    client.query(sql,arr,function(err,result){
        if(err){
            console.log(err);
            res.status(404).send(err)
        }
        else{
            res.send(body);
        }
    })
})
app.put('/svr/mobiles/:id',function(req,res){
    let {body}=req
    let {id}=req.params
    let arr=Object.values(body)
    let arr2=[...arr,id]
   let sql='update  mobiles set name=$1,price=$2,brand=$3,ram=$4,rom=$5,os=$6 where id=$7'
   client.query(sql,arr2,function(err,result){
       if(err){
           console.log(err);
           res.status(404).send(err)
       }
       else{
           res.send(body);
       }
   })
})
app.delete('/svr/mobiles/:id',function(req,res){
    
    let {id}=req.params
   
   let sql='delete from mobiles where id=$1'
   client.query(sql,[id],function(err,result){
       if(err){
           console.log('err is:',err);
           res.status(404).send(err)
       }
       else{
           res.send('mobile is deleted successfully');
       }
   })
})



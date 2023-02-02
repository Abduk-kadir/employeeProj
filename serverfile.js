let express=require("express")
//let mysql=require('mysql')
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
//const port=2410
var port= process.env.PORT || 2410;
const {Client}=require("pg")
const client= new Client(
    {
        user:"postgres",
        password:"iltutmish@2022",
        database:"postgres",
        port:5432,
        host:"db.flfurqnvbdlcuhsyrwoz.supabase.co",
        ssl:{rejectUnauthorized:false}
    }
);
client.connect(function(err,error){
    console.log('connected!!!');
})
app.listen(port,()=>console.log(`Node app is listinng${port}`))

let connData={
    host:"localhost",
    user:"root",
    password:"1994",
    database:"testDb"
}
let connection=mysql.createConnection(connData)

app.get('/svr/employees',function(req,res){

    let {designation,department,gender}=req.query
    let sql='select * from employees'
    client.query(sql,function(err,result){
        if(err){
            res.status(404).send(err)
        }
        else{
            
           result=designation?result.filter(elem=>elem.designation==designation):result
           result=department?result.filter(elem=>elem.department==department):result
           result=gender?result.filter(elem=>elem.gender==gender):result
           res.send(result)
          
        }
        client.end();
    })
})

app.get('/svr/employees/department/:dept',function(req,res){
    let {dept}=req.params
    let sql='select * from employees'
    client.query(sql,function(err,result){
        if(err){
            res.status(404).send(err)
        }
        else{
            let arr=result.filter(elem=>elem.department==dept)
            res.send(arr)
           
        }
        client.end()
    })
    
})
app.get('/svr/employees/designation/:des',function(req,res){
    let {des}=req.params
    let sql='select * from employees'
    client.query(sql,function(err,result){
        if(err){
            res.status(404).send(err)
        }
        else{
            let arr=result.filter(elem=>elem.designation==des)
            res.send(arr)
          
        }
        client.end()
    })
    
})





app.post('/svr/employees',function(req,res){
    let {body}=req
    let {name,department,designation,salary,gender}=body
    let sql='insert into employees(name,department,designation,salary,gender) values(?,?,?,?,?)'
    client.query(sql,[name,department,designation,salary,gender],function(err,result){
        if(err){
            res.send(err)
        }
        else{
            res.send(body)
           
        }
        client.end()
    })

})


app.put('/svr/employees/:id',function(req,res){
    let {body}=req
    let {id}=req.params
    let {name,department,designation,salary,gender}=body
    let sql='select * from employees'
    client.query(sql,function(err,result){
        if(err){
            res.status(404).send(err)
        }
    else{
    let sql2='update employees set name=?,department=?,designation=?,salary=?, gender=? where id=?'
    let index=result.findIndex(elem=>elem.id==id)
    if(index>=0){
    client.query(sql2,[name,department,designation,salary,gender,id],function(err,result){
        if(err){
            res.status(404).send(err)
        }
        else{
            res.send({...body,id:id})
           
        }
    })
  } 
  else{
    res.status(404).send('no employee found for editing detail')
  } 
}
})
})




app.delete('/svr/employees/:id',function(req,res){
     let {id}=req.params
    
     let sql='select * from employees'
     client.query(sql,function(err,result){
        if(err){
            res.status(404).send(err)
        }
        else{
            let index=result.findIndex(elem=>elem.id==id)
            if(index>=0){
               let sql2='delete from employees where id=?'
               client.query(sql2,id,function(err,result2){
                 if(err){
                    res.status(404).send(err)
                 }
                 else{
                    let emp=result[index]
                    res.send(emp)
                 }

               })
            }
            else{
               res.send('no employee is found for deleting')
              
            }
        }
     })

    

})
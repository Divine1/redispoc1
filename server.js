var express = require("express")
var app = express()

var redis = require("redis"),
redisClient = redis.createClient();

app.get("/testroute",(req,res)=>{
    console.log("in /testroute")

    let inp = req.query.key
    if(inp){
        console.log("true")
    }
    else{
        console.log("false")
    }
    console.log("inp ",inp)
    res.send("in testroute");
});

app.get("/store",(req,res)=>{
    console.log("/store method")
    console.log("req.query ",req.query )
    var id = req.query.id 
    var value = req.query.value
    /*
    redisClient.set(id,value,(err,data)=>{
        if(err){
            console.log("err ",err)
            res.send({data:"not stored"})
        }
        else{
            console.log("data ",data)
            res.send({data:"stored"})
        }
    })
    */
   redisClient.set(id,value,'EX',86400,(err,data)=>{
        if(err){
            console.log("err ",err)
            res.send({data:"not stored"})
        }
        else{
            console.log("data ",data)
            res.send({data:"stored"})
        }
    })
})

app.get("/get",(req,res)=>{
    console.log("/get method")
    var id = req.query.id 
    redisClient.get(id,(err,data)=>{
        if(err) throw err 
        if(data !=null){
            console.log("data not null in cache")
            res.send({data : data})
        }
        else{
            console.log("data is null in cache")
            res.send({data : "data is empty"})
        }
    })
})

app.get("/keys",(req,res)=>{
    console.log("/keys method")

    redisClient.keys("*",(err,data)=>{
        if(err) throw err 
        if(data !=null){
            console.log("data ",data)
            console.log("data not null in cache")
            res.send({data : data})
        }
        else{
            console.log("data is null in cache")
            res.send({data : data})
        }
    })

})
const delkeyfun = (data)=>{
    console.log("delkey() ")
    data.forEach(element => {
        redisClient.del(element,(err,result)=>{
            if(err){
                console.log("error while deleting")
                console.log("err ",err)
            }
            else{
                console.log("result ",result)
            }
        })
    });
    
}

app.get("/cache/clear",(req,res)=>{
    console.log("/keys method")
    const delkey = req.query.key;

    
    redisClient.keys(delkey+"*",(err,data)=>{
        if(err) throw err 
        if(data !=null){
            console.log("data ",data)
            delkeyfun(data)
            console.log("data not null in cache")
            res.send({data : data})
        }
        else{
            console.log("data is null in cache")
            res.send({data : data})
        }
    })

})
app.get("/flush",(req,res)=>{
    console.log("/flush method")
    redisClient.flushdb((err,success)=>{
        console.log("success ",success)        
        console.log("err ",err)
        res.send({data:"flush method"})

    })
})


app.listen(3500,()=>{
    console.log("port running on 3500")
})
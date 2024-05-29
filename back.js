const mongoose=require('mongoose')
const express=require('express')
const app=express()
var path = require('path')
var bodyParser = require('body-parser')
app.use(express.static(path.join(__dirname, '/public')))

let user="none"
let alcohol=["Bailey's Irish Cream","SMIRNOFF No.21 Red Label","JACK DANIEL’S Old No.7 Black Label","DOM PERIGNON Vintage 2013","CAPTAIN MORGAN Rum","GLENFIDDICH 12 Year Old","Roku Gin","BOMBAY SAPPHIRE London Dry Gin","GORDON’S London Dry Gin","JOHNNIE WALKER Blue Label","TANQUERAY London Dry Gin","Martell Cordon Bleu","Hennessy VSOP"]
let cost=[99,99,99,99,99,99,99,99,99,99,99,99,99,99]

mongoose.connect("mongodb+srv://rahulrahuln2001:mantralaya@cluster0.mxjxcg7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

app.set('view engine','ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }))

const schema1=new mongoose.Schema({
    id:String,
    uname:String,
    password:String,
    phone:Number
})
const schema2 = new mongoose.Schema({
    uname:String,
    item_id:[Number],
    total:Number
})
const users= mongoose.model("users",schema1)
const cart= mongoose.model("order",schema2)


app.get("/",async function(req,res){
res.render("index.ejs",{user:user})
})

app.get("/order",async function(req,res){
    if(user=='none'){
        res.render("login.ejs",{sun:{bol:true,sol:true}})
    }
    res.render("order.ejs")
    })
 
app.get('/logout',(req,res)=>{
    user="none"
    res.render("index.ejs",{user:user})
})

app.get("/register",(req,res)=>{
    res.render("register.ejs")
})

app.get("/placed",(req,res)=>{
    res.render("placed.ejs")
})

app.get("/login",(req,res)=>{
    res.render("login",{sun:{bol:true,sol:true}})
})


app.post("/registerpo",(req,res)=>{
    let us=new users({
        id:Date.now().toString(36),
        uname:req.body.uname,
        password:req.body.upass,
        phone:req.body.uphone
    })
    us.save()
    res.render("register.ejs")
})

app.post("/place",(req,res)=>{
    let total1=0,item=[],temcost=[],qty=req.body
    for(let i=0;i<8;i++)
        {
            if(req.body[i]>0)
                {
                    item.push(i)
                    total1+=cost[i]*req.body[i]
                    temcost.push(cost[i]*req.body[i])
                }
        }
    let ss=new cart({
        uname:user,
        item_id:item,
        total:total1
    })
    ss.save()

    res.render("placed.ejs",{alc:alcohol,item:item,temc:temcost,total:total1,qty:qty})
    
})

app.post("/login",async function(req,res){
    console.log(req.body.uname)
    let val=await users.findOne({uname:req.body.uname})
    let bol=false
    let sun={bol:false,sol:true}
    console.log(val)
    if(!val)
        {
        console.log("not found")
        res.render("login.ejs",{sun,})
        
        }
    else
    {
        if(val.password==req.body.upass)
        {
            user=val.uname;
            res.render("index.ejs",{user:user})
        }
        else{
            res.render("login.ejs",{sun:{bol:true,sol:false}})
        }
    }
})

app.listen(3000,()=>{
    console.log("server connected")
})
import  express  from "express";
const app = express();
const port = 9000;

app.get('/getName',(req,res)=>{

 res.json({message:"Hello Adam freeman"});

});

app.use('/',(req,res)=>{

    res.json({message:"Hello from Express Hosted app"})
})


app.listen(9000, ()=>{
    console.log(`Server Started at Port ${port}`);
})

const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
dotenv.config({path: './config.env'});

port=process.env.PORT;

const app=express();
require('./db/conn');

app.use(express.json({limit: '8mb'}));
app.use(express.urlencoded({limit: '8mb', extended: true}));

app.use(cookieParser());

app.use(require('./router/auth'))

if(process.env.NODE_ENV == 'production'){
    const path=require('path');
    app.get('/',(req,res)=>{
        app.use(express.static(path.resolve(__dirname,'client','build')));
        res.sendFile(path.resolve(__dirname,'client','build','index.html'));
    });
}

app.listen(port,()=>{
    console.log(`server running at ${port}`);
})
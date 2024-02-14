const express = require("express");
const httpProxy = require('http-proxy')
const app = express();

const proxy =  httpProxy.createProxy()

// this is public url from S3 bucket(will be diff for our own bucket)
const BASE_PATH = 'https://vercel-clone-outputs.s3.ap-south-1.amazonaws.com/__outputs'

app.use((req,res)=>{
    const hostname = req.hostname
    const subdomain = hostname.split('.')[0]

    const resolveTo = `${BASE_PATH}/${subdomain}/index.html`

    return proxy.web(req,res,{target:resolveTo, changeOrigin:true})
})

app.listen(8000, ()=>{
    console.log("Listening at PORT 8000")
})
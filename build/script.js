const {exec} = require('child_process')
const fs = require('fs')
const path = require('path')
const {S3Client , PutObjectCommand} = require('@aws-sdk/client-s3')
const mime = require('mime-types')

const PROJECT_ID = process.env.PROJECT_ID;

const s3Client = new S3Client({
    region:'',
    credentials:{
        accessKeyId:'',
        secretAccessKey:'',
    }
})

async function init(){
    console.log("Build Process Starting")

    const outDirPath = path.join(__dirname,'output')

    const command = exec(`cd ${outDirPath} && npm install && npm run build`)

    command.stdout.on('data', (data)=>{
        console.log(data)
    })

    command.stdout.on('error', (err)=>{
        console.log(err)
    })

    command.on('close', async () =>{
        const distDirPath = path.join(__dirname,'output', 'dist')

        const buildStream = fs.readdirSync(distDirPath,{recursive:true})


        for(const file of buildStream){

            const filePath = path.join(distDirPath, file)
            if(fs.lstatSync(filePath).isDirectory()) continue;

            const command = new PutObjectCommand({
                Bucket: 'Vercel-Clone-outputs',
                Key:`__outputs/${PROJECT_ID}/${file}`,
                Body:fs.createReadStream(filePath),
                ContentType: mime.lookup(filePath),
            })


            await s3Client.send(command);
            console.log('Uploaded', filePath);
        }

        console.log('DONE.......')

})


init();




}
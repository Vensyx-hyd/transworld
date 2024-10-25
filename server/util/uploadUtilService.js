const ftp = require("basic-ftp")
const fs = require("fs")
 
async function fileUpload(file,fileName) {
    const client = new ftp.Client()
    client.ftp.verbose = true
    try {
        await client.access({
            host: "40.122.108.211",
            user: "cfsfm",
            password: "Cfs1234",
            secure: false,
            port: "21"
        })
        //console.log(await client.list())
        return await client.upload(fs.createReadStream(file), "/Admin files/"+fileName);
    }
    catch(err) {
        console.log(err)
    }
    client.close()
}

module.exports={
    fileUpload
}
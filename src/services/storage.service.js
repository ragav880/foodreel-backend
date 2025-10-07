const ImageKit = require("imagekit");
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,

  
});

async function uploadFile(files,fileNames){
    try {
        const result = await imagekit.upload({
            file:files,
            fileName:fileNames
        })
        return result;
        
    } catch (error) {
        console.log(error)
        throw error;
    }
}


module.exports = {uploadFile}
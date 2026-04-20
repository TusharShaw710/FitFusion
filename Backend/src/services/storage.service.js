import ImageKit, { toFile } from '@imagekit/nodejs';
import config from "../config/config.js"


const client = new ImageKit({
  privateKey: config.IMAGE_KIT_SECRET
});

export async function uploadImages({images,filename,folder="FitFusion"}){
    try {
        const result=await Promise.all(images.map(async(image)=>{
            const response=await client.files.upload({
                file:await toFile(Buffer.from(image.buffer),filename),
                fileName:filename,
                folder:folder
            })
            return {url : response.url };
        }));

        return result;
    } catch (error) {
        console.log(error);
        throw new Error("Failed to upload images");
    }
}

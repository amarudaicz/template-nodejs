import cloudinary, { ConfigOptions } from 'cloudinary';

// Configuracion Cloudinary
export function cloudConfig(){
    
    const config:ConfigOptions= {
        cloud_name: process.env.CLOUD_NAME_CLOUDINARY,
        api_key: process.env.API_KEY_CLOUDINARY,
        api_secret: process.env.SECRET_CLOUDINARY
    }
    
    cloudinary.v2.config(config);
    console.log('cloudinary-online'); 
    
    
} 
    
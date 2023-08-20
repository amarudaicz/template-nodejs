import fs  from "fs";
import { Router } from "express";
const router = Router()


const PATH_ROUTES = __dirname

const removeExtension = (fileName:string) => {
    return fileName.split('.').shift()
}

fs.readdirSync(PATH_ROUTES).filter((fileName)=>{
    const name = removeExtension(fileName)// ["index", "tracks", "storage"]
    
    if (name !== 'index') {
        console.log(`Cargando ruta... /${name}`);
        
        import(`./${name}`).then((moduleRouter)=>{
            router.use(`/${name}`, moduleRouter.router)
        })
    }
    

})

 


export {router}
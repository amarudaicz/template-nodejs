import { httpError } from '../utils/httpError';
import { doQuery } from '../mysql/config';
import { Request, Response } from 'express';
import { Option, Product, Variation } from '../interface/product';
import { User } from '../interface/user';
import * as cloudinary from 'cloudinary'
import { Admin } from '../interface/admin';
import * as fs from 'fs'

export const postCategory = async (req: Request, res: Response) => {
  try {

    const {category_name, category_description, sort_order} = req.body
    const {local_id, admin_table} = (req as any).user
    console.log(req.body);  
    
    const file = req.file

    let imageUrlCloudinary:null|string = null

    if (file){
      const imageUpload = await cloudinary.v2.uploader.upload(file.path, {
        folder: admin_table,
        public_id: category_name.replace(' ', '-' ).trim() || category_name,
        overwrite: true,
        quality: 90
      });
      
      imageUrlCloudinary = imageUpload.secure_url;

      fs.rm(file.path, ()=> console.log(`rm(${file.path})`))
    }

    console.log(file);
  
    

    

    const data = await doQuery(`INSERT INTO categories (category_name, category_image,category_description, sort_order, local_id) VALUES(?,?,?,?,?)`, [category_name, imageUrlCloudinary,category_description, sort_order, local_id])
    

    res.send(data).status(200)


  } catch (err: any) {
    httpError(res, err, 202);
  }
};


export const updateCategory = async (req: Request, res: Response) => {
  try {

    const {category_name, category_description , id, sort_order } = req.body
    let {image} = req.body
    image = image  !== 'null' ? image : null
    
    
    const {local_id, admin_table} = (req as any).user

    console.log(req.body);  
    
    const file = req.file
    
    let imageUrlCloudinary:null|string = null

    if (file){
      const imageUpload = await cloudinary.v2.uploader.upload(file.path, {
        folder: admin_table,
        public_id: category_name.replace(' ', '-' ).trim() || name,
        overwrite: true,
        quality: 90
      });
      
      imageUrlCloudinary = imageUpload.secure_url;

      fs.rm(file.path, ()=> console.log(`rm(${file.path})`))
    }

    console.log(file);
  

    const data = await doQuery(`UPDATE categories SET category_name = ?, category_description = ?, category_image = ?  WHERE id = ?`, [category_name, category_description, imageUrlCloudinary || image, Number(id)])
     

    res.send(data).status(200)


  } catch (err: any) {
    httpError(res, err, 202);
  }
};

export const deleteCategory = async (req:Request, res:Response) => {

  try {


    const {id} = req.params

    const data = await doQuery(`DELETE FROM categories WHERE id = ? `, [Number(id)])

    res.send(data)
    
  } catch (err) {
    console.log(err);
    httpError(res, err as string)
    
    
  }

}




export const getCategories = async (req: Request, res: Response) => {
  try {

    console.log((req as any).user);
    
    const {local_id} = (req as any).user

    const data = await doQuery(`SELECT * FROM categories WHERE local_id = ? `, [local_id])
  
    res.send(data).status(200)

  } catch (err: any) {
    httpError(res, err, 202);
  }
};




export const stateCategory = async (req:Request, res:Response)=>{

  try {
    
    const user = (req as any).user
    const {category_id, state} = (req.body as {category_id:number, state:number})

    const data = await doQuery(`UPDATE categories SET active = ? WHERE id = ?`, [state, category_id])

    res.json(data).status(200)


  } catch (err: any) {
    httpError(res, err); 
  }

}
export const putSortOrder = async (req:Request, res:Response)=>{

  try {

    const categories:any[] = req.body.categories 

    console.log(categories);
    
    const idsToUpdate = categories.map((categoria) => categoria.id).join(',');
    let query = `UPDATE categories 
             SET sort_order = CASE id 
             ${categories.map((categoria) => `WHEN ${categoria.id} THEN ${categoria.sort_order}`).join(' ')}
             END
             WHERE id IN (${idsToUpdate})`;
             
    const data = await doQuery(query, [])

    console.log(data);
    res.send(data)
    
  } catch (err: any) {
    httpError(res, err);
  }

}





export const postOptions = async (req: Request, res: Response) => {
  try {
    
    const {local_id} = (req as any).user
    const {options} = req.body
    console.log(options);
    

    if (!options) {
      httpError(res, 'No proporciono opciones')
      return
    }


    const data = await doQuery(
      `UPDATE locals SET 
      options_group = ?
  
      WHERE id = ?;`,
      [JSON.stringify(options), local_id]
    );

    res.json(data)


  } catch (err: any) {
    httpError(res, err, 202);
  }
};


export const putOptions = async (req: Request, res: Response) => {
  try {
    const user = ((req as any).user as Admin)
    const {products, group, variations} = req.body //PRODUCTS IDS

    const updateLocalOptions = await doQuery(`UPDATE locals SET options_group = ? WHERE id = ?`, [JSON.stringify(variations), user.local_id ])

    if (!products.length) {
      res.send(updateLocalOptions)
      return
    }

    const productsRecovery:Product[] | any[] = await doQuery(`SELECT * FROM ${user.admin_table} WHERE id IN (${ products.join(',') })`, [user.local_id])


    const updatedProducts = productsRecovery.map((product: any) => {
      product.variations = JSON.parse(product.variations);
      const index = product.variations.findIndex((variation: any) => variation.nameVariation === group.nameVariation);
      product.variations[index] = group;
      return product;
    });
    
    // Construir la consulta SQL con múltiples valores
    const updateQuery = `
      UPDATE ${user.admin_table}
      SET variations = CASE 
        ${updatedProducts.map((product: any) => `WHEN id = ${product.id} THEN '${JSON.stringify(product.variations)}'`).join(' ')}
        ELSE variations
      END
      WHERE id IN (${products.join(',')})
    `;

    const data = await doQuery(updateQuery, []);
    console.log(data);
    

    res.send(data).status(200)

  } catch (err: any) {
    httpError(res, err, 202);
  }
};


export const deleteOptionGroup = async (req: Request, res: Response) => {
  try {

    console.log((req as any).user);
    
    const {local_id} = (req as any).user
    const {id:idGroup} = req.params

    console.log(idGroup);
    
    let dataSet = await doQuery(`SELECT options_group FROM locals WHERE id = ?`, [local_id])
    console.log({esto:dataSet});
    dataSet = JSON.parse(dataSet[0].options_group)
    dataSet = dataSet.filter((e:Variation)=> e.id !== Number(idGroup))
    
    
    const data = await doQuery(`UPDATE locals SET options_group = ? WHERE id = ?` , [JSON.stringify(dataSet), local_id])

    res.send(data).status(200)


  } catch (err: any) {
    console.log(err);
    
    httpError(res, err, 202);
  }
};


  
  
  
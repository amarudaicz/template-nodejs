import mysql2 from "mysql2";

const dbUri = 'mysql://vps3_admin:Contrasenacss3@149.50.129.17:3306/vps3_deli';

 const pool = mysql2.createPool({
  connectionLimit: 10,
  user: process.env.DB_USER,
  password:process.env.DB_PASSWORD ,
  port:Number(process.env.DB_PORT),
  host:process.env.DB_HOST ,
  database:process.env.DB_NAME 
 });  
   
  

 
  
// CREATE USER 'vps3_admin'@'190.220.19.48' IDENTIFIED BY '12345678';
// GRANT ALL PRIVILEGES ON *.* TO 'vps3_admin'@'190.220.19.48' WITH GRANT OPTION;

 

export const poolConnection = () => {
  pool.getConnection((err) => {
    if (err) { 
      console.log(err);
    } else {
      console.log("R");
    } 
  }); 
}; 

export const doQuery = (query: string, data: any) => {
  return new Promise<any>((resolve, reject) => {
    const formatQuery = mysql2.format(query, data);

     pool.query<any>(formatQuery, (error, results, fields) => {
       if (error) return reject(error); // <- se rechaza la promesa y se pasa el motivo
       resolve(results); // <- se resuelve la Promesa y se pasa el resultado
      });
  });
};

poolConnection() 

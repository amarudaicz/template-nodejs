import { Request, Response } from "express";
import { doQuery } from "../mysql/config";
import { formatDate } from "../utils/formatDate";
import { httpError } from "../utils/httpError";
import { User } from "../interface/user";

interface Sale {
  id?:number;
  local_id?:number;
  date: string;
  ammount: number;
  total_sales:number;
}

export const postSale = async (req: Request, res: Response) => {
  try {
    const { id: local_id, ammount } = req.body;
    const date = formatDate(new Date());

    const data = await doQuery(
      `INSERT INTO sales (local_id, date, ammount) VALUES (?, ?, ?)`,
      [local_id, date, ammount]
    );
    console.log(data);

    console.log(date);

    res.send("ok");
  } catch (error: any) {
    httpError(res, error);
  }
};

export const getSales = async (req: Request , res: Response) => {
  try {
    const { local_id } = (req as any).user;

    console.log((req as any).user);
    
    // Query to get visits grouped by date
    const query = `
            SELECT date, SUM(amount) as ammount, count(*) as total_sales
            FROM sales
            WHERE local_id = ?
            GROUP BY date; `; 

    const sales: Sale[] = await doQuery(query, [local_id]);

    console.log(sales);
    
    if (!sales.length) {      
      res.send('No se registraron ventas')
      return
    }
    
    const formatSales: Sale[] = fillMissingDays(sales.map((row) => ({
      date: formatDate(row.date as any),
      ammount: Number(row.ammount) ,
      total_sales: row.total_sales ,
    }))).slice(-31)

    res.json(formatSales);
  } catch (err) {
    console.log(err);
  }
};


function fillMissingDays(dataArray:Sale[]):Sale[] {
  const sortedArray = dataArray.sort((a, b) => a.date.localeCompare(b.date));
  const resultArray = [];

  const startDate = new Date(sortedArray[0].date);
  const endDate = new Date(sortedArray[sortedArray.length - 1].date);

  for (let currentDate = startDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
    const dateString = currentDate.toISOString().split("T")[0];
    const existingData = sortedArray.find((item) => item.date === dateString);

    if (existingData) {
      resultArray.push(existingData);
    } else {
      resultArray.push({ date: dateString, ammount: 0, total_sales:0 });
    }
  }

  return resultArray;
}
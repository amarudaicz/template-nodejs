import { Request, Response } from "express";
import { doQuery } from "../mysql/config";
import { User } from "../interface/user";
import { Admin } from "../interface/admin";
import { formatDate } from "../utils/formatDate";




interface Stat{
  date:string,
  total_visits:number
}

export const postView = async (req: Request, res: Response) => {
  const local_id = req.body.id;
  const date = formatDate(new Date());

  const data = await doQuery(
    `INSERT INTO stats (local_id, date) VALUES (?, ?)`,
    [local_id, date]
  );
  console.log(data);

  console.log(date);
  res.send(data);
};

export const getStats = async (req: Request, res: Response) => {

  const {local_id} = (req as any).user as Admin
  console.log(local_id);
  try {
    // Query to get visits grouped by date
    const query = `
        SELECT date, COUNT(*) as total_visits
        FROM stats
        WHERE local_id = ?
        GROUP BY date
      `;

    const data:Stat[] = await doQuery(query, [local_id]);
    if (!data.length) {
      res.send('No existen registros')
      return
    }


    // Format the results to include date and total_visits
    const formatData:Stat[] = fillMissingDays(data.map((row: any) => ({
      date: formatDate(row.date),
      total_visits: row.total_visits,
    }))).slice(-31);
    


    res.json(formatData);
  } catch (error) {
    console.error("Error while fetching statistics:", error);
    res.status(500).json({ error: "Error while fetching statistics." });
  }
};






function fillMissingDays(dataArray:Stat[]):Stat[] {
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
      resultArray.push({ date: dateString, total_visits: 0 });
    }
  }

  return resultArray;
}

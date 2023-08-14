import { Request, Response } from 'express';
import { addHeadersToResponse } from './server-helpers';
import { pool } from '../config/postgres';

export async function upsert(req: Request, res: Response) {
    addHeadersToResponse(res);

  try {
     const client = await pool.connect();

    await client.query(`CREATE TABLE IF NOT EXISTS people (id SERIAL PRIMARY KEY, name varchar(255));`);
    const sql = `INSERT INTO people(name) values ('Rodrigo'), ('Leila')`;
    await client.query(sql) 
    const result = await client.query(`SELECT * FROM people;`);
    
    client.release();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json('Error on upsert' + error);
  }
}
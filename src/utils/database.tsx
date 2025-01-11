"use server";
import { neon } from "@neondatabase/serverless";


async function getData() {
  const sql = neon(process.env.DATABASE_URL as string );
  const response = await sql`select * from project;`;
  return response[0].version;
}

export default async function Page() {
  const data = await getData();
  return <>{data}</>;
}
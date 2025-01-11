import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(req: Request) {
  try {
    const { title, picture, report_id } = await req.json();

    
    if (!title || !picture || !report_id) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const sql = neon(process.env.DATABASE_URL as string);

   
    await sql`
      INSERT INTO daily_activities (title, picture, report_id) 
      VALUES (${title}, ${picture}, ${report_id})
    `;


    return NextResponse.json({ message: "Daily activity added successfully" });
  } catch (error) {
    console.error("Error inserting daily activity:", error);


    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

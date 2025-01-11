import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(req: Request) {
  try {
    const { name, date, observations, company_id } = await req.json();

    
    if (!name || !date || !observations || !company_id) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const sql = neon(process.env.DATABASE_URL as string);

    
    await sql`
      INSERT INTO well (Name, Date, Observations, company_id) 
      VALUES (${name}, ${date}, ${observations}, ${company_id})
    `;

    
    return NextResponse.json({ message: "Well added successfully" });
  } catch (error) {
    console.error("Error inserting well:", error);

    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

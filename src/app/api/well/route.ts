import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(req: Request) {
  try {
    const { name, date, observations, company_id } = await req.json();


    if (!name || !date || !observations || !company_id) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const sql = neon(process.env.DATABASE_URL as string);


    const result = await sql`
      INSERT INTO well (Name, Date, Observations, company_id) 
      VALUES (${name}, ${date}, ${observations}, ${company_id}) 
      RETURNING *
    `;


    return NextResponse.json(result[0]);

  } catch (error) {
    console.error("Error inserting well:", error);


    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function GET() {
  try {

    const sql = neon(process.env.DATABASE_URL as string);

    const wells = await sql`
      SELECT * FROM well;
    `;


    return NextResponse.json(wells);

  } catch (error) {
    console.error('Error fetching wells:', error);


    return NextResponse.json(
      { error: 'Failed to fetch wells' },
      { status: 500 }
    );
  }
}

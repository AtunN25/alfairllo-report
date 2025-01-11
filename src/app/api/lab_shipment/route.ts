import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(req: Request) {
  try {
    const { laboratory_name, status, well_id } = await req.json();

   
    if (!laboratory_name || !status || !well_id) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const sql = neon(process.env.DATABASE_URL as string);


    await sql`
      INSERT INTO lab_shipment (laboratory_name, status, well_id) 
      VALUES (${laboratory_name}, ${status}, ${well_id})
    `;

  
    return NextResponse.json({ message: "Lab shipment added successfully" });
  } catch (error) {
    console.error("Error inserting lab shipment:", error);

  
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(req: Request) {
  try {
    const { project_id, well_id } = await req.json();

    
    if (!project_id || !well_id) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const sql = neon(process.env.DATABASE_URL as string);

    
    await sql`
      INSERT INTO detail_well (project_id, well_id) 
      VALUES (${project_id}, ${well_id})
    `;

   
    return NextResponse.json({ message: "Detail well added successfully" });
  } catch (error) {
    console.error("Error inserting detail well:", error);

    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

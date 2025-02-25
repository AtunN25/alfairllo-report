import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(req: Request) {
  try {
    const { speaker, time, report_id } = await req.json();

    
    if (!speaker || !time || !report_id) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const sql = neon(process.env.DATABASE_URL as string);

    
    const result = await sql`
      INSERT INTO safety_talk (speaker, "time", report_id) 
      VALUES (${speaker}, ${time}, ${report_id}) RETURNING id
    `;

  
     // Extraer el report_id del resultado
     const safety_talk_id = result[0].id;

     // Retornar el report_id en la respuesta
     return NextResponse.json({ message: 'Report added successfully', safety_talk_id });
  } catch (error) {
    console.error("Error inserting safety talk:", error);


    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

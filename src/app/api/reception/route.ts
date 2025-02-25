import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(req: Request) {
  try {
    const { from, to, well_id } = await req.json();

    
    if (from === undefined || to === undefined || !well_id) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const sql = neon(process.env.DATABASE_URL as string);

    
    const result = await sql`
      INSERT INTO reception ("From", "To", well_id)
      VALUES (${from}, ${to}, ${well_id}) RETURNING id
    `;

    
    // Extraer el report_id del resultado
    const reception_id = result[0].id;

    // Retornar el report_id en la respuesta
    return NextResponse.json({ message: 'Report added successfully', reception_id });

  } catch (error) {
    console.error("Error inserting reception:", error);

    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(req: Request) {
  try {
    const { laboratory_name, status, well_id } = await req.json();

   
    if (!laboratory_name || !status || !well_id) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const sql = neon(process.env.DATABASE_URL as string);


    const result = await sql`
      INSERT INTO lab_shipment (laboratory_name, status, well_id) 
      VALUES (${laboratory_name}, ${status}, ${well_id}) RETURNING id
    `;

  
    // Extraer el report_id del resultado
    const laboratorio_id = result[0].id;

    // Retornar el report_id en la respuesta
    return NextResponse.json({ message: 'Report added successfully', laboratorio_id });
  } catch (error) {
    console.error("Error inserting lab shipment:", error);

  
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

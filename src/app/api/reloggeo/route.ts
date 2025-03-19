import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(req: Request) {
  try {
    // Extraer los datos del cuerpo de la solicitud
    const { priority, well_id, programed, from, to, relogging, geologist, date, observation } = await req.json();

    // Validar que todos los campos requeridos estén presentes
    if (!priority || !well_id || !from || !to || !relogging || !geologist || !date) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Conectar a la base de datos
    const sql = neon(process.env.DATABASE_URL as string);

    // Insertar datos en la tabla Reloggeo
    const result = await sql`
      INSERT INTO Reloggeo (
        priority, well_id, programed, "from", "to" , relogging, geologist, "date", observation
      ) 
      VALUES (
        ${priority}, ${well_id}, ${programed}, ${from}, ${to}, ${relogging}, ${geologist}, ${date}, ${observation}
      )
      RETURNING *
    `;

    // Devolver el resultado de la inserción
    return NextResponse.json(result[0]);

  } catch (error) {
    console.error("Error inserting Reloggeo:", error);

    // Manejar errores
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(req: Request) {
  try {
    // Obtener datos del cuerpo de la solicitud
    const { description, detail_well_id } = await req.json();

    // Validar los campos requeridos
    if (!description || !detail_well_id) {
      return NextResponse.json(
        { error: 'Both "description" and "detail_well_id" are required' },
        { status: 400 }
      );
    }

    // Configurar conexión a la base de datos
    const sql = neon(process.env.DATABASE_URL as string);

    // Ejecutar la consulta de inserción
    await sql`
      INSERT INTO Point_well(Description, Datail_well_id)
      VALUES (${description}, ${detail_well_id})
    `;

    // Respuesta exitosa
    return NextResponse.json({ message: 'Point_well added successfully' });
  } catch (error) {
    console.error('Error inserting Point_well:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

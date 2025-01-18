import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(req: Request) {
  try {
    const { description, activity_id } = await req.json();

    // Validación de los campos requeridos
    if (!description || !activity_id) {
      return NextResponse.json(
        {
          error: `"description" and "activity_id" are required`,
        },
        { status: 400 }
      );
    }

    const sql = neon(process.env.DATABASE_URL as string);

    // Inserción en la base de datos
    await sql`
      INSERT INTO Point(Description, activity_id)
      VALUES (${description}, ${activity_id})
    `;

    return NextResponse.json({ message: 'Point added successfully' });
  } catch (error) {
    console.error('Error inserting Point:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

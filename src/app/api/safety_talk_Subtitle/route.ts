import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(req: Request) {
  try {
    const { subtitle, safety_talk_id } = await req.json();

    // Validación de los campos requeridos
    if (!subtitle || !safety_talk_id) {
      return NextResponse.json(
        {
          error: `"subtitle" and "safety_talk_id" are required`,
        },
        { status: 400 }
      );
    }

    const sql = neon(process.env.DATABASE_URL as string);

    // Inserción en la base de datos
    await sql`
      INSERT INTO safety_talk_Subtitle(subtitle, safety_talk_id)
      VALUES (${subtitle}, ${safety_talk_id})
    `;

    return NextResponse.json({ message: 'Safety talk subtitle added successfully' });
  } catch (error) {
    console.error('Error inserting safety_talk_Subtitle:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

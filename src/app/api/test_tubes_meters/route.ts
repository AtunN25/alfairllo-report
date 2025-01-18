import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(req: Request) {
    try {
      const { from, to, from_meters, to_meters, reception_id } = await req.json();
  
      if (!from || !to || !from_meters || !to_meters || !reception_id) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
      }
  
      const sql = neon(process.env.DATABASE_URL as string);
  
      await sql`
        INSERT INTO Test_tubes_meters("From", "To", From_meters, To_meters, reception_id)
        VALUES (${from}, ${to}, ${from_meters}, ${to_meters}, ${reception_id})
      `;
  
      return NextResponse.json({ message: 'Test tubes meters data added successfully' });
    } catch (error) {
      console.error('Error inserting Test tubes meters:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
  
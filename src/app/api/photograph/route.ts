import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(req: Request) {
    try {
      const { from, to, reception_id } = await req.json();
  
      if (!from || !to || !reception_id) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
      }
  
      const sql = neon(process.env.DATABASE_URL as string);
  
      await sql`
        INSERT INTO Photograph("From", "To", reception_id)
        VALUES (${from}, ${to}, ${reception_id})
      `;
  
      return NextResponse.json({ message: 'Photograph data added successfully' });
    } catch (error) {
      console.error('Error inserting Photograph:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
  
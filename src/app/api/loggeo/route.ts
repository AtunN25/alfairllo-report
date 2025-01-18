import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(req: Request) {
  try {
    const { date, from, to, well_id } = await req.json();

    if (!date || from === undefined || to === undefined || !well_id) {
      return NextResponse.json(
        { error: '"date", "from", "to", and "well_id" are required' },
        { status: 400 }
      );
    }

    const sql = neon(process.env.DATABASE_URL as string);

    await sql`
      INSERT INTO Loggeo(Date, "From", "To", well_id)
      VALUES (${date}, ${from}, ${to}, ${well_id})
    `;

    return NextResponse.json({ message: 'Loggeo added successfully' });
  } catch (error) {
    console.error('Error inserting Loggeo:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

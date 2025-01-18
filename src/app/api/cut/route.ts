import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(req: Request) {
    try {
      const { date, from, to, uncut_meters, observation, well_id } = await req.json();
  
      if (
        !date ||
        from === undefined ||
        to === undefined ||
        uncut_meters === undefined ||
        !observation ||
        !well_id
      ) {
        return NextResponse.json(
          {
            error: '"date", "from", "to", "uncut_meters", "observation", and "well_id" are required',
          },
          { status: 400 }
        );
      }
  
      const sql = neon(process.env.DATABASE_URL as string);
  
      await sql`
        INSERT INTO Cut(Date, "From", "To", Uncut_Meters, Observation, well_id)
        VALUES (${date}, ${from}, ${to}, ${uncut_meters}, ${observation}, ${well_id})
      `;
  
      return NextResponse.json({ message: 'Cut added successfully' });
    } catch (error) {
      console.error('Error inserting Cut:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
  
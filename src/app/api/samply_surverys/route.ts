import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(req: Request) {
    try {
      const { date, from, to, unsampled_meters, well_id } = await req.json();
  
      if (
        !date ||
        from === undefined ||
        to === undefined ||
        unsampled_meters === undefined ||
        !well_id
      ) {
        return NextResponse.json(
          {
            error: '"date", "from", "to", "unsampled_meters", and "well_id" are required',
          },
          { status: 400 }
        );
      }
  
      const sql = neon(process.env.DATABASE_URL as string);
  
      await sql`
        INSERT INTO Sampling_surveys(Date, "From", "To", Unsampled_Meters, well_id)
        VALUES (${date}, ${from}, ${to}, ${unsampled_meters}, ${well_id})
      `;
  
      return NextResponse.json({ message: 'Sampling_surveys added successfully' });
    } catch (error) {
      console.error('Error inserting Sampling_surveys:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
  
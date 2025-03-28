import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(req: Request) {
  try {
    const { date, trc, trc_from, trc_to, meters_from, meters_to, observation, samples, lab_shipment_id } = await req.json();

    // Validación de los campos requeridos
    if (
      !date ||
      !trc ||
      trc_from === undefined ||
      trc_to === undefined ||
      meters_from === undefined ||
      meters_to === undefined ||
      !observation ||
      !samples ||
      !lab_shipment_id
    ) {
      return NextResponse.json(
        {
          error: `"date", "trc", "trc_from", "trc_to", "meters_from", "meters_to", "observation", "status", and "lab_shipment_id" are required`,
        },
        { status: 400 }
      );
    }

    const sql = neon(process.env.DATABASE_URL as string);

    // Inserción en la base de datos
    await sql`
      INSERT INTO Sample_Shipment(
        Date, TRC, TRC_from, TRC_to, Meters_from, Meters_to, Observation, samples, lab_shipment_id
      )
      VALUES (
        ${date}, ${trc}, ${trc_from}, ${trc_to}, ${meters_from}, ${meters_to}, ${observation}, ${samples}, ${lab_shipment_id}
      )
    `;

    return NextResponse.json({ message: 'Sample shipment added successfully' });
  } catch (error) {
    console.error('Error inserting Sample_Shipment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

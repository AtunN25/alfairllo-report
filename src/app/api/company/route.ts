import {NextResponse} from 'next/server'
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL as string);

export async function GET() {
  try {
    
    const response = await sql`SELECT * FROM company;`;

    
    return NextResponse.json(response);

    console.log(response)

  } catch (error) {
    console.error('Error al obtener datos:', error);

    
    return NextResponse.json(
      { error: 'No se pudieron obtener los datos' },
      { status: 500 }
    );
  }
}



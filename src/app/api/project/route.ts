import { NextResponse } from 'next/server';
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL as string );


async function getProjects() {
  const response = await sql`SELECT * FROM project;`;
  return response;
}

// Controlador 
export async function GET() {
  try {
    const data = await getProjects();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error al obtener datos:', error);
    return NextResponse.json({ error: 'No se pudieron obtener los datos' }, { status: 500 });
  }
}

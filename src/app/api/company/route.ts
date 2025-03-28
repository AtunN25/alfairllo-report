import {NextResponse} from 'next/server'
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL as string);

export async function POST(request: Request) {
  try {
    // Obtener los datos del cuerpo de la solicitud
    const body = await request.json();
    const { name } = body;

    // Validar que se proporcionó el nombre
    if (!name) {
      return NextResponse.json(
        { error: 'El nombre de la compañía es requerido' },
        { status: 400 }
      );
    }

    // Insertar la nueva compañía en la base de datos
    const response = await sql`
      INSERT INTO company (name) 
      VALUES (${name})
      RETURNING *;
    `;

    // Devolver la compañía creada con status 201 (Created)
    return NextResponse.json(response[0], { status: 201 });

  } catch (error) {
    console.error('Error al crear la compañía:', error);

    // Manejar errores específicos de PostgreSQL
    if (error instanceof Error && error.message.includes('unique constraint')) {
      return NextResponse.json(
        { error: 'Ya existe una compañía con ese nombre' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Error al crear la compañía' },
      { status: 500 }
    );
  }
}

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



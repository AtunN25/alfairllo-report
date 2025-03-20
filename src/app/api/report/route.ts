import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(req: Request) {
    try {
        const { date, overseer, email, project_id } = await req.json();

        // Validar que todos los campos estén presentes
        if (!date || !overseer || !email || !project_id) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const sql = neon(process.env.DATABASE_URL as string);

        // Insertar el reporte y retornar el report_id generado
        const result = await sql`
            INSERT INTO report (Date, Overseer, Email, project_id)
            VALUES (${date}, ${overseer}, ${email}, ${project_id})
            RETURNING id
        `;

        // Extraer el report_id del resultado
        const report_id = result[0].id;

        // Retornar el report_id en la respuesta
        return NextResponse.json({ message: 'Report added successfully', report_id });
    } catch (error) {
        console.error('Error inserting report:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const sql = neon(process.env.DATABASE_URL as string);

        // Obtener todos los reportes de la base de datos
        const reports = await sql`
            SELECT * FROM report
        `;

        // Retornar los reportes en la respuesta
        return NextResponse.json({ reports });
    } catch (error) {
        console.error('Error fetching reports:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
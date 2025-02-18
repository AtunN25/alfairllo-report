// src/app/api/pdf/route.ts
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { neon } from '@neondatabase/serverless';

interface ProjectData {
  name: string;
}

function populateTemplate(html: string, data: ProjectData): string {
 
  return html.replace('{{project_name}}', data.name || 'Nombre no disponible');
}

// Manejar solicitudes GET
export async function GET(req: Request) {
  try {

    const { searchParams } = new URL(req.url);
    const project_id = searchParams.get('project_id');

    if (!project_id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    // Conectar a la base de datos y obtener los datos
    const sql = neon(process.env.DATABASE_URL as string);
    const result = await sql`
      SELECT json_build_object(
        'project', json_build_object(
          'id', p.id,
          'name', p.Name,
          'reports', json_agg(
            json_build_object(
              'id', r.id,
              'date', r.Date,
              'overseer', r.Overseer,
              'safety_talks', (
                SELECT json_agg(
                  json_build_object(
                    'id', s.id,
                    'speaker', s.Speaker,
                    'time', s.Time,
                    'subtitles', (
                      SELECT json_agg(
                        json_build_object('id', sa.id, 'subtitle', sa.Subtitle)
                      ) FROM safety_talk_subtitle sa WHERE sa.safety_talk_id = s.id
                    )
                  )
                ) FROM safety_talk s WHERE s.report_id = r.id
              ),
              'daily_activities', (
                SELECT json_agg(
                  json_build_object(
                    'id', d.id,
                    'title', d.Title,
                    'points', (
                      SELECT json_agg(
                        json_build_object('id', po.id, 'description', po.Description)
                      ) FROM point po WHERE po.activity_id = d.id
                    )
                  )
                ) FROM daily_activities d WHERE d.report_id = r.id
              )
            )
          )
        )
      ) as data
      FROM project p
      JOIN report r ON p.id = r.project_id
      WHERE p.id = ${project_id}
      GROUP BY p.id;
    `;

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const jsonData = result[0].data;

    // Ruta al archivo HTML dentro de src/components/pdf/
    const htmlFilePath = path.join(process.cwd(), 'src', 'components', 'pdf', 'template.html');
    let htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
    htmlContent = populateTemplate(htmlContent, jsonData.project);

    // Iniciar Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Cargar el contenido HTML en la página
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0', // Esperar a que se carguen todos los recursos
    });

    // Generar el PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm',
      },
    });

    // Cerrar el navegador
    await browser.close();

    // Enviar el PDF como respuesta
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=reporte.pdf',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Error generating PDF' }, { status: 500 });
  }
}

// Manejar solicitudes POST (si es necesario)
export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ message: 'POST request received', data: body });
}
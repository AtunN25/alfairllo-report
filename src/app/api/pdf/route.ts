// src/app/api/pdf/route.ts
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

// Manejar solicitudes GET
export async function GET() {
  try {
    // Ruta al archivo HTML dentro de src/components/pdf/
    const htmlFilePath = path.join(process.cwd(), 'src', 'components', 'pdf', 'template.html');
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

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
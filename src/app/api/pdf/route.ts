// src/app/api/pdf/route.ts
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { neon } from '@neondatabase/serverless';

interface ProjectData {
  project: {
    id: number;
    name: string;
    reports: {
      id: number;
      date: string;
      overseer: string;
      email: string;
      safety_talks: {
        id: number;
        speaker: string;
        time: string;
        subtitles: {
          id: number;
          subtitle: string;
        }[];
      }[];
      daily_activities: {
        id: number;
        title: string;
        picture: string;
        points: {
          id: number;
          description: string;
        }[];
      }[];
    }[];
  };
  wells: {
    id: number;
    name: string;
    date: string;
    observations: string;
    company: {
      id: number;
      name: string;
    };
    receptions: {
      id: number;
      from: number;
      to: number;
      photographs: {
        id: number;
        from: number;
        to: number;
      }[];
      regularized: {
        id: number;
        from: number;
        to: number;
      }[];
      rqd: {
        id: number;
        from: number;
        to: number;
      }[];
      susceptibility: {
        id: number;
        from: number;
        to: number;
      }[];
      test_tubes_meters: {
        id: number;
        from: number;
        to: number;
        from_meters: number;
        to_meters: number;
      }[];
    }[];
    loggeo: {
      id: number;
      date: string;
      from: number;
      to: number;
    }[];
    cut: {
      id: number;
      date: string;
      from: number;
      to: number;
      uncut_meters: number;
      observation: string;
    }[];
    sampling_surveys: {
      id: number;
      date: string;
      from: number;
      to: number;
      unsampled_meters: number;
    }[];
    lab_shipments: {
      id: number;
      laboratory_name: string;
      status: string;
      sample_shipments: {
        id: number;
        date: string;
        trc: string;
        trc_from: number;
        trc_to: number;
        meters_from: number;
        meters_to: number;
        observation: string;
        status: string;
      }[];
    }[];
  }[];
}


function populateTemplate(html: string, data: ProjectData): string {
  console.log("📌 Data recibida:", JSON.stringify(data, null, 2));

  let populatedHtml = html.replace("{{project_name}}", data.project.name || "Nombre no disponible");

  // Extraer actividades diarias y charlas de seguridad desde reports
  const dailyActivities = data.project.reports.flatMap(report => report.daily_activities || []);
  const safetyTalks = data.project.reports.flatMap(report => report.safety_talks || []);

  console.log("📌 Actividades Diarias:", dailyActivities);
  console.log("📌 Charlas de Seguridad:", safetyTalks);

  // Reemplazar charla de seguridad (asumiendo que solo hay una por ahora)
  if (safetyTalks.length > 0) {
    const safetyTalk = safetyTalks[0];

    // Reemplazar speaker y time
    populatedHtml = populatedHtml
      .replace("{{speaker}}", safetyTalk.speaker)
      .replace("{{time}}", safetyTalk.time);

    // Generar dinámicamente la lista de subtítulos
    if (safetyTalk.subtitles && safetyTalk.subtitles.length > 0) {
      const subtitlesList = safetyTalk.subtitles
        .map(subtitle => `<li>${subtitle.subtitle}</li>`)
        .join(""); // Convertir el array de <li> en un string

      // Reemplazar el placeholder {{subtitles}} con la lista generada
      populatedHtml = populatedHtml.replace(
        '<ol type="A">{{subtitles}}</ol>',
        `<ol type="A">${subtitlesList}</ol>`
      );
    } else {
      // Si no hay subtítulos, mostrar un mensaje
      populatedHtml = populatedHtml.replace(
        '<ol type="A">{{subtitles}}</ol>',
        '<ol type="A">No hay subtítulos disponibles</ol>'
      );
    }
  } else {
    populatedHtml = populatedHtml
      .replace("{{speaker}}", "No hay orador")
      .replace("{{time}}", "Sin tiempo especificado")
      .replace('<ol type="A">{{subtitles}}</ol>', '<ol type="A">No hay charlas de seguridad disponibles</ol>');
  }

  // Reemplazar actividades diarias
  if (dailyActivities.length > 0) {
    dailyActivities.forEach((activity, index) => {
      // Reemplazar el título de la actividad
      populatedHtml = populatedHtml.replace(`{{daily_activity_${index}}}`, activity.title);

      // Generar dinámicamente la lista de puntos (points)
      if (activity.points && activity.points.length > 0) {
        const pointsList = activity.points
          .map(point => `<li>${point.description}</li>`)
          .join(""); // Convertir el array de <li> en un string

        // Reemplazar el placeholder {{points_X}} con la lista generada
        populatedHtml = populatedHtml.replace(
          `<ul>{{points_${index}}}</ul>`,
          `<ul>${pointsList}</ul>`
        );
      } else {
        // Si no hay puntos, mostrar un mensaje
        populatedHtml = populatedHtml.replace(
          `<ul>{{points_${index}}}</ul>`,
          `<ul>No hay puntos disponibles</ul>`
        );
      }
    });
  } else {
    // Si no hay actividades diarias, mostrar un mensaje
    populatedHtml = populatedHtml.replace(/{{daily_activity_\d+}}/g, "No hay actividades diarias disponibles");
    populatedHtml = populatedHtml.replace(/<ul>{{points_\d+}}<\/ul>/g, "<ul>No hay puntos disponibles</ul>");
  }

  return populatedHtml;
}




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
              'email', r.Email,
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
                    'picture', d.Picture,
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
        ),
        'wells', (
          SELECT json_agg(
            json_build_object(
              'id', w.id,
              'name', w.Name,
              'date', w.Date,
              'observations', w.Observations,
              'company', (
                SELECT json_build_object(
                  'id', c.id,
                  'name', c.Name
                )
                FROM company c
                WHERE c.id = w.company_id
              ),
              'receptions', (
                SELECT json_agg(
                  json_build_object(
                    'id', rec.id,
                    'from', rec."From",
                    'to', rec."To",
                    'photographs', (
                      SELECT json_agg(
                        json_build_object(
                          'id', ph.id,
                          'from', ph."From",
                          'to', ph."To"
                        )
                      )
                      FROM Photograph ph
                      WHERE ph.reception_id = rec.id
                    ),
                    'regularized', (
                      SELECT json_agg(
                        json_build_object(
                          'id', reg.id,
                          'from', reg."From",
                          'to', reg."To"
                        )
                      )
                      FROM Regularized reg
                      WHERE reg.reception_id = rec.id
                    ),
                    'rqd', (
                      SELECT json_agg(
                        json_build_object(
                          'id', rqd.id,
                          'from', rqd."From",
                          'to', rqd."To"
                        )
                      )
                      FROM RQD rqd
                      WHERE rqd.reception_id = rec.id
                    ),
                    'susceptibility', (
                      SELECT json_agg(
                        json_build_object(
                          'id', sus.id,
                          'from', sus."From",
                          'to', sus."To"
                        )
                      )
                      FROM Susceptibility sus
                      WHERE sus.reception_id = rec.id
                    ),
                    'test_tubes_meters', (
                      SELECT json_agg(
                        json_build_object(
                          'id', ttm.id,
                          'from', ttm."From",
                          'to', ttm."To",
                          'from_meters', ttm.From_meters,
                          'to_meters', ttm.To_meters
                        )
                      )
                      FROM Test_tubes_meters ttm
                      WHERE ttm.reception_id = rec.id
                    )
                  )
                )
                FROM Reception rec
                WHERE rec.well_id = w.id
              ),
              'loggeo', (
                SELECT json_agg(
                  json_build_object(
                    'id', l.id,
                    'date', l.Date,
                    'from', l."From",
                    'to', l."To"
                  )
                )
                FROM Loggeo l
                WHERE l.well_id = w.id
              ),
              'cut', (
                SELECT json_agg(
                  json_build_object(
                    'id', c.id,
                    'date', c.Date,
                    'from', c."From",
                    'to', c."To",
                    'uncut_meters', c.Uncut_Meters,
                    'observation', c.Observation
                  )
                )
                FROM Cut c
                WHERE c.well_id = w.id
              ),
              'sampling_surveys', (
                SELECT json_agg(
                  json_build_object(
                    'id', ss.id,
                    'date', ss.Date,
                    'from', ss."From",
                    'to', ss."To",
                    'unsampled_meters', ss.Unsampled_Meters
                  )
                )
                FROM Sampling_surveys ss
                WHERE ss.well_id = w.id
              ),
              'lab_shipments', (
                SELECT json_agg(
                  json_build_object(
                    'id', ls.id,
                    'laboratory_name', ls.Laboratory_name,
                    'status', ls.Status,
                    'sample_shipments', (
                      SELECT json_agg(
                        json_build_object(
                          'id', samp.id,
                          'date', samp.Date,
                          'trc', samp.TRC,
                          'trc_from', samp.TRC_From,
                          'trc_to', samp.TRC_To,
                          'meters_from', samp.Meters_From,
                          'meters_to', samp.Meters_to,
                          'observation', samp.Observation,
                          'status', samp.Status
                        )
                      )
                      FROM Sample_Shipment samp
                      WHERE samp.lab_shipment_id = ls.id
                    )
                  )
                )
                FROM Lab_Shipment ls
                WHERE ls.well_id = w.id
              )
            )
          )
          FROM Well w
        )
      ) AS json_data
      FROM 
        project p
        INNER JOIN report r ON p.id = r.project_id
      WHERE 
        p.id = ${project_id}
      GROUP BY 
        p.id;
    `;

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const jsonData: ProjectData = result[0].json_data;

    console.log(jsonData);

    // Ruta al archivo HTML dentro de src/components/pdf/
    const htmlFilePath = path.join(process.cwd(), 'src', 'components', 'pdf', 'template.html');
    let htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
    htmlContent = populateTemplate(htmlContent, jsonData);

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
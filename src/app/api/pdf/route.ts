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
    name: string | null;
    date: string | null;
    observations: string | null;
    company: {
      id: number;
      name: string | null;
    };
    receptions: {
      id: number;
      from: number | null;
      to: number | null;
      photographs: {
        id: number;
        from: number | null;
        to: number | null;
      }[];
      regularized: {
        id: number;
        from: number | null;
        to: number | null;
      }[];
      rqd: {
        id: number;
        from: number | null;
        to: number | null;
      }[];
      susceptibility: {
        id: number;
        from: number | null;
        to: number | null;
      }[];
      test_tubes_meters: {
        id: number;
        from: number | null;
        to: number | null;
        from_meters: number | null;
        to_meters: number | null;
      }[];
    }[];
    loggeo: {
      id: number;
      date: string | null;
      from: number | null;
      to: number | null;
    }[];
    cut: {
      id: number;
      date: string | null;
      from: number | null;
      to: number | null;
      uncut_meters: number | null;
      observation: string | null;
    }[];
    sampling_surveys: {
      id: number;
      date: string | null;
      from: number | null;
      to: number | null;
      unsampled_meters: number | null;
    }[];
    lab_shipments: {
      id: number;
      laboratory_name: string | null;
      status: string | null;
      sample_shipments: {
        id: number;
        date: string | null;
        trc: string | null;
        trc_from: number | null;
        trc_to: number | null;
        meters_from: number | null;
        meters_to: number | null;
        observation: string | null;
        status: string | null;
      }[];
    }[];
  }[];
}



function populateTemplate(html: string, data: ProjectData): string {
  console.log("📌 Data recibida:", JSON.stringify(data, null, 2));

  // Extraer datos generales
  const reportDate = data.project.reports.length > 0 ? data.project.reports[0].date : "Fecha no disponible";
  const overseer = data.project.reports.length > 0 ? data.project.reports[0].overseer : "Supervisor no disponible";
  const email = data.project.reports.length > 0 ? data.project.reports[0].email : "Correo no disponible";
  const projectName = data.project.name || "Nombre no disponible";
  const year = reportDate ? new Date(reportDate).getFullYear() : "Año no disponible";

  // Reemplazar placeholders generales
  let populatedHtml = html
    .replace("{{project_name}}", projectName)
    .replace("{{date}}", reportDate)
    .replace("{{Overseer}}", overseer)
    .replace("{{name}}", projectName)
    .replace("{{Date.Year}}", year.toString())
    .replace("{{email}}", email);

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

  // Generar dinámicamente la lista de actividades diarias
  if (dailyActivities.length > 0) {
    let activitiesHtml = "";

    dailyActivities.forEach((activity, index) => {
      // Agregar el título de la actividad como un elemento de lista numerada
      activitiesHtml += `<h3>${index + 1}. ${activity.title}</h3>`;

      // Si hay puntos, generar una lista de descripciones
      if (activity.points && activity.points.length > 0) {
        const pointsList = activity.points
          .map(point => `<li>${point.description}</li>`)
          .join(""); // Convertir el array de <li> en un string

        activitiesHtml += `<ul>${pointsList}</ul>`;
      }
    });

    // Reemplazar el placeholder {{daily_activities}} con la lista generada
    populatedHtml = populatedHtml.replace("{{daily_activities}}", activitiesHtml);
  } else {
    // Si no hay actividades diarias, mostrar un mensaje
    populatedHtml = populatedHtml.replace("{{daily_activities}}", "<p>No hay actividades diarias disponibles</p>");
  }

  // Generar dinámicamente las tablas de pozos
  if (data.wells && data.wells.length > 0) {
    let wellsHtml = `


    <table border="1">
  <thead>
    <tr>
      <!-- Encabezados principales -->
      <th>METROS DE SONDAJE DDH LIBERADOS POR GEOLOGIA</th>
      <th>AVANCES EN CORTE Y MUESTREO DE SONSAJES DDH</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <!-- Primera celda con las dos tablas dentro -->
      <td>
        <div style="display: flex; flex-direction: row;">
          <table>
            <thead>
              <tr>
                <th>EMPRESA</th>
                <th>FECHA</th>
                <th>POZOS</th>
              </tr>
            </thead>
           <tbody>
          ${data.wells.map(well => `
            <tr>
              <td>${well.company.name}</td>
              <td>${well.date}</td>
              <td>${well.name}</td>
            </tr>
          `).join("")}
        </tbody>
          </table>

          <br> <!-- Espacio entre tablas -->

          <table border="1">
            <thead>
              <tr>
                <th colspan="3">LOGGEO / MTS LIBERADO</th>
              </tr>
              <tr>
                <th>DESDE</th>
                <th>HASTA</th>
                <th>TOTAL</th>
              </tr>
            </thead>
             ${data.wells.flatMap(well => (well.loggeo ?? []).map(log => `
            <tr>
              <td>${log.from}</td>
              <td>${log.to}</td>
              <td>${(log.to ?? 0) - (log.from ?? 0)}</td>
            </tr>
          `)).join("")}
          </table>
        </div>
      </td>

      <!-- Segunda celda vacía (o puedes agregar contenido) -->
      <td>
        <div style="display: flex; flex-direction: row;">
          <table>
            <thead>
              <tr>
                <th>EMPRESA</th>
                <th>FECHA</th>
                <th>POZOS</th>
              </tr>

            </thead>
            <tbody>
            ${data.wells.map(well => `
              <tr>
                <td>${well.company.name}</td>
                <td>${well.date}</td>
                <td>${well.name}</td>
              </tr>
            `).join("")}
            </tbody>
          </table>

          <br> <!-- Espacio entre tablas -->

          <table border="1">
            <thead>
              <tr>
                <th colspan="3">CUT</th>
              </tr>
              <tr>
                <th>DESDE</th>
                <th>HASTA</th>
                <th>TOTAL</th>
              </tr>
            </thead>
             <tbody>
          ${data.wells.flatMap(well => (well.cut ?? []).map(cut => `
            <tr>
              <td>${cut.from}</td>
              <td>${cut.to}</td>
              <td>${(cut.to ?? 0) - (cut.from ?? 0)}</td>
            </tr>
          `)).join("")}
        </tbody>
          </table>

          <br> <!-- Espacio entre tablas -->

          <table>
            <thead>
              <tr>
                <th>METROSS SIN CORTAR</th>
                <th>OBSERVACION</th>
              </tr>

            </thead>
            <tbody>
            ${data.wells.flatMap(well => (well.cut ?? []).map(cut => `
              <tr>
                <td>${cut.uncut_meters}</td>
                <td>${cut.observation}</td>
              </tr>
            `)).join("")}
            </tbody>
          </table>

          <br> <!-- celeste -->
          <table>
            <thead>
              <tr>
                <th>EMPRESA</th>
                <th>FECHA</th>
              </tr>

            </thead>
            <tbody>
              ${data.wells.map(well => `
              <tr>
                <td>${well.company.name}</td>
                <td>${well.date}</td>
              </tr>
            `).join("")}
            </tbody>
          </table>

          <table border="1">
            <thead>
              <tr>
                <th colspan="3">MUESTREO</th>
              </tr>
              <tr>
                <th>DESDE</th>
                <th>HASTA</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
          ${data.wells.flatMap(well => (well.sampling_surveys ?? []).map(survey => `
            <tr>
              <td>${survey.from}</td>
              <td>${survey.to}</td>
              <td>${(survey.to ?? 0) - (survey.from ?? 0)}</td>
            </tr>
          `)).join("")}
        </tbody>
          </table>

          <table>
            <thead>
              <tr>
                <th>METROS SIN MUESTREAR</th>
              </tr>
            </thead>
            <tbody>
            ${data.wells.flatMap(well => (well.sampling_surveys ?? []).map(survey => `
              <tr>
                <td>${survey.unsampled_meters}</td>
                
              </tr>
            `)).join("")}
            </tbody>
          </table>
        </div>
      </td>
    </tr>
  </tbody>
</table>


    `;

    // Reemplazar el placeholder {{wells_tables}} con las tablas generadas
    populatedHtml = populatedHtml.replace("{{wells_tables}}", wellsHtml);
  } else {
    // Si no hay pozos, mostrar un mensaje
    populatedHtml = populatedHtml.replace("{{wells_tables}}", "<p>No hay datos de pozos disponibles</p>");
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
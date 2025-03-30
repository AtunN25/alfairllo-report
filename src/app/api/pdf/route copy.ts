// src/app/api/pdf/route.ts
import { NextResponse } from 'next/server';

import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium'

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
        samples: number | null;
      }[];
    }[];
    reloggeo: {
      id: number;
      priority: string | null;
      programed: string | null;
      from: number | null;
      to: number | null;
      relogging: number | null;
      geologist: string | null;
      date: string | null;
      observation: string | null;
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

  const time = data.project.reports.length > 0 ? data.project.reports[0].safety_talks[0].time : "tiempo no disponible";
  const speaker = data.project.reports.length > 0 ? data.project.reports[0].safety_talks[0].speaker : "Supervisor no disponible";

  console.log(data.project.reports[0])
  // Reemplazar placeholders generales
  let populatedHtml = html
    .replace("{{project_name}}", projectName)
    .replace("{{date}}", reportDate)
    .replace("{{Overseer}}", overseer)
    .replace("{{name}}", projectName)
    .replace("{{Date.Year}}", year.toString())
    .replace("{{email}}", email)
    .replace("{{time}}", time)
    .replace("{{speaker}}", speaker);

  // Extraer actividades diarias y charlas de seguridad desde reports
  const dailyActivities = data.project.reports.flatMap(report => report.daily_activities || []);
  const safetyTalks = data.project.reports.flatMap(report => report.safety_talks || []);

  console.log("📌 Actividades Diarias:", dailyActivities);
  console.log("📌 Charlas de Seguridad:", safetyTalks[0].subtitles);

  console.log("📌 time:", time);
  console.log("📌 speaker:", speaker);

  const imagen = dailyActivities[0]?.picture || null;
  console.log("📌 imagen:", imagen);

  // Reemplazar charla de seguridad (asumiendo que solo hay un orador)
  if (safetyTalks.length > 0) {
    let safetyTalkHtml = "";

    const safetyTalk = safetyTalks[0]; // Solo el primer orador

    // Verificar si hay subtítulos y generar la lista
    if (safetyTalk.subtitles && safetyTalk.subtitles.length > 0) {
      const subtitlesList = safetyTalk.subtitles
        .map(subtitle => `<li>${subtitle.subtitle}</li>`)
        .join(""); // Convertir los subtítulos en HTML

      safetyTalkHtml += `<ol type="A">${subtitlesList}</ol>`;
    } else {
      safetyTalkHtml += `<p>No hay subtítulos disponibles.</p>`;
    }

    // Reemplazar el placeholder {{safety_talks}} con el contenido generado
    populatedHtml = populatedHtml.replace("{{safety_talks}}", safetyTalkHtml);
  } else {
    // Si no hay charlas de seguridad
    populatedHtml = populatedHtml.replace("{{safety_talks}}", "<p>No hay charlas de seguridad disponibles.</p>");
  }

  // Verificar si hay una imagen disponible
  if (imagen) {
    // Crear el HTML para la imagen
    const imageHtml = `<img src="${imagen}" alt="Imagen de la actividad" style="max-width: 100%; height: auto; margin-bottom: 20px;" />`;

    // Reemplazar el placeholder {{imagen}} con la imagen
    populatedHtml = populatedHtml.replace("{{imagen}}", imageHtml);
  } else {
    // Si no hay imagen, mostrar un mensaje
    populatedHtml = populatedHtml.replace("{{imagen}}", "<p>No hay imágenes disponibles</p>");
  }

  // Generar dinámicamente la lista de actividades diarias
  if (dailyActivities.length > 0) {
    let activitiesHtml = "";

    dailyActivities.forEach((activity, index) => {
      // Agregar el título de la actividad como un elemento de lista numerada
      activitiesHtml += `<h3>${index + 2}. ${activity.title}</h3>`;

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
    populatedHtml = populatedHtml.replace("{{daily_activities}}", "<p>There are no daily activities available.</p>");
  }

    // Generar dinámicamente las tablas de pozos
    if (data.wells && data.wells.length > 0) {
      const wellsHtml = `

      <table border="1">
    <thead>
      <tr>
        <!-- Encabezados principales -->
        <th>DRILLING METERS (DDH) RELEASED BY GEOLOGY</th>
        <th>DDH CUTTING AND SAMPLING PROGRESS</th>
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
                <th>COMPANY</th>
                  <th>DATE</th>
                  <th>HOLES</th>
                </tr>
              </thead>
            <tbody>
            
            ${data.wells.flatMap(well =>

        (well.loggeo ?? []).map(loggeo => `
                <tr>
                  <td>${well.company.name}</td>
                  <td>${reportDate}</td>
                  <td>${well.name}</td>
                  <!-- ${loggeo} --> <!-- Aquí podrías usar loggeo si lo necesitas -->
                </tr>
              `)
      ).join("")}
          </tbody>
            </table>

            <br> <!-- Espacio entre tablas -->

            <table border="1">
              <thead>
                <tr>
                  <th colspan="3">LOGGING/RELEASED MTS</th>
                </tr>
                <tr>
                  <th>FROM</th>
                  <th>TO</th>
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
                  <th>COMPANY</th>
                  <th>DATE</th>
                  <th>HOLES</th>
                </tr>

              </thead>
              <tbody>
              ${data.wells.flatMap(well =>
        (well.cut ?? []).map(cut => `
          <tr>
            <td>${well.company.name}</td>
            <td>${reportDate}</td>
            <td>${well.name}</td>
            <!-- ${cut} --> <!-- Aquí podrías usar loggeo si lo necesitas -->
          </tr>
        `)
      ).join("")}
              </tbody>
            </table>

            <br> <!-- Espacio entre tablas -->

            <table border="1">
              <thead>
                <tr>
                  <th colspan="3">CUT</th>
                </tr>
                <tr>
                  <th>FROM</th>
                  <th>TO</th>
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
                  <th>UNCUT METERS</th>
                  <th>OBSERVATION</th>
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
                  <th>COMPANY</th>
                  <th>DATE</th>
                  <th>HOLES</th>
                </tr>

              </thead>
              <tbody>
                ${data.wells.flatMap(well =>
        (well.sampling_surveys ?? []).map(survey => `
          <tr>
            <td>${well.company.name}</td>
            <td>${reportDate}</td>
            <td>${well.name}</td>
            <!-- ${survey} --> <!-- Aquí podrías usar survey si lo necesitas -->
          </tr>
        `)
      ).join("")}
              </tbody>
            </table>

            <table border="1">
              <thead>
                <tr>
                  <th colspan="3">MUESTREO</th>
                </tr>
                <tr>
                  <th>FROM</th>
                  <th>TO</th>
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
                  <th>UNSAMPLED METERS</th>
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
      populatedHtml = populatedHtml.replace("{{wells_tables}}", "<p>No well data available</p>");
    }

  // Generar dinámicamente la tabla de laboratorios
  if (data.wells && data.wells.length > 0) {
    // Calcular los totales
    let totalMuestras = 0;
    let totalMetros = 0;

    const sampleRows = data.wells.flatMap(well =>
      (well.lab_shipments ?? []).flatMap(shipment =>
        (shipment.sample_shipments ?? []).map(sample => {
          const muestras = sample.samples ?? 0
          const metros = (sample.meters_to ?? 0) - (sample.meters_from ?? 0);

          totalMuestras += muestras;
          totalMetros += metros;

          return { ...sample, wellName: well.name, wellDate: well.date }; // Agregamos los datos del pozo
        })
      )
    );

    const labHtml = `
      <div>
        <div>
          <table border="1" style="width: 100%;">
            <thead>
              <tr>
                <th colspan="8">DRILL SAMPLE SHIPMENT TO LABORATORY</th>
              </tr>
              <tr>
                <th>DATE</th>
                <th>HOLE</th>
                <th>TRC</th>
                <th colspan="2">TRC RANGE</th>
                <th colspan="2">METERS</th>
                <th>Total samples</th>
                <th>Total meters</th>
                <th>OBSERVATION</th>
              </tr>
              <tr>
                <th></th>
                <th></th>
                <th></th>
                <th>FROM</th>
                <th>TO</th>
                <th>FROM</th>
                <th>TO</th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${sampleRows.map(sample => `
                <tr>
                  <td>${reportDate}</td> <!-- Fecha del pozo -->
                  <td>${sample.wellName}</td> <!-- Nombre del pozo -->
                  <td>${sample.trc}</td>
                  <td>${sample.trc_from}</td>
                  <td>${sample.trc_to}</td>
                  <td>${sample.meters_from}</td>
                  <td>${sample.meters_to}</td>
                  <td>${sample.samples}</td>
                  <td>${(sample.meters_to ?? 0) - (sample.meters_from ?? 0)}</td>
                  <td>${sample.observation}</td>
                </tr>
              `).join('')}
              <tr style="font-weight: bold; background-color: #f2f2f2;">
                <td colspan="7" style="text-align: right;">TOTAL GENERAL</td>
                <td>${totalMuestras}</td>
                <td>${totalMetros}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    populatedHtml = populatedHtml.replace("{{lab_tables}}", labHtml);
  } else {
    populatedHtml = populatedHtml.replace("{{lab_tables}}", "<p>No hay datos de laboratorio disponibles</p>");
  }

  // Generar dinámicamente las tablas de recepciones
  if (data.wells && data.wells.length > 0) {
    const receptionsHtml = `
        <table>
          <thead>
            <tr>
            
              <th rowspan="2">LOGO</th>

             
               <th>Drill Sample Reception</th>

              
              <th rowspan="2">DAILY SAMPLING PROGRESS DGG 2024</th>
            </tr>
            <tr>
              <!-- Columna del medio: Turno día y noche -->
              <th>Day & Night Shift</th>
            </tr>
          </thead>
          <tbody style="padding: 0; border: none;">
            <tr>
              <!-- Celda del LOGO con tabla interna -->
              <td style="padding: 0; border: none;">
                <table>
                  <thead style="height: 21px;">
                    <tr>
                      <th>COMPANY</th>
                      <th>DATE</th>
                      <th>HOLE</th>
                    </tr>

                  </thead>
                  <tbody>
                  
                  ${data.wells.flatMap(well =>
      (well.receptions ?? []).map(reception => `
                      <tr>
                        <td>${well.company.name}</td>
                        <td>${reportDate}</td>
                        <td>${well.name}</td>
                        <!-- ${reception} --> <!-- Aquí podrías usar survey si lo necesitas -->
                      </tr>
                    `).join("")
    ).join("")}
                  </tbody>
                </table>
              </td>
              <!-- Otras celdas -->
              <td style="padding: 0; border: none;">
                <table>
                  <thead>
                    <tr>
                      <!-- Primera columna: LOGO -->
                      <th rowspan="2" COLSPAN=2>Sample Reception</th>

                      <!-- Columna del medio: Recepción Muestra de perforación -->
                       <th>MTS</th>

                    </tr>
                    <tr>
                      <!-- Columna del medio: Turno día y noche -->
                     <th>DRILLED</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${data.wells
        .flatMap(well =>
          (well.receptions ?? []).flatMap(reception => `
                             
                                <tr>
                                  <td>${reception.from}</td>
                                  <td>${reception.to}</td>
                                  <td>${((reception.to ?? 0) - (reception.from ?? 0)).toFixed(2)}</td>
  
                                </tr>
                              
                            `)
        )
        .join("")}
                  </tbody>
                </table>
        </td>

        <td style="padding: 0; border: none;">


          <div style="display: flex; flex-direction: row;">
            <table>
              <thead>
                <!-- Primer encabezado que ocupa 3 columnas -->
                <tr>
                   <th colspan="3">PHOTOGRAPHS</th>
                </tr>
                <!-- Segundo encabezado con 3 columnas -->
                <tr>
                  <th>FROM</th>
                  <th>TO</th>
                  <th>TOTAL</th>
                </tr>
              </thead>
              <tbody>
              
               ${data.wells
        .flatMap(well =>
          (well.receptions ?? []).flatMap(receptions =>
            (receptions.photographs ?? []).map(photograph => `
                                <tr>
                                  <td>${photograph.from}</td>
                                  <td>${photograph.to}</td>
                                  <td>${((photograph.to ?? 0) - (photograph.from ?? 0)).toFixed(2)}</td>
                          
                                </tr>
                              `)
          )
        )
        .join("")}
              </tbody>
            </table>

            <table>
              <thead>
                <!-- Primer encabezado que ocupa 3 columnas -->
                <tr>
                  <th colspan="3">REGULARIZED</th>
                </tr>
                <!-- Segundo encabezado con 3 columnas -->
                <tr>
                  <th>FROM</th>
                  <th>TO</th>
                  <th>TOTAL</th>
                </tr>
              </thead>
               ${data.wells
        .flatMap(well =>
          (well.receptions ?? []).flatMap(receptions =>
            (receptions.regularized ?? []).map(regularized => `
                                <tr>
                                  <td>${regularized.from}</td>
                                  <td>${regularized.to}</td>
                                  <td>${((regularized.to ?? 0) - (regularized.from ?? 0)).toFixed(2)}</td>
                              
                                </tr>
                              `)
          )
        )
        .join("")}
            </table>

            <table>
              <thead>
                <!-- Primer encabezado que ocupa 3 columnas -->
                <tr>
                  <th colspan="3">RQD</th>
                </tr>
                <!-- Segundo encabezado con 3 columnas -->
                <tr>
                  <th>FROM</th>
                  <th>TO</th>
                  <th>TOTAL</th>
                </tr>
              </thead>
              <tbody>
              ${data.wells
        .flatMap(well =>
          (well.receptions ?? []).flatMap(receptions =>
            (receptions.rqd ?? []).map(rqd => `
                      <tr>
                        <td>${rqd.from}</td>
                        <td>${rqd.to}</td>
                        <td>${((rqd.to ?? 0) - (rqd.from ?? 0)).toFixed(2)}</td>
             
                      </tr>
                    `)
          )
        )
        .join("")}
              </tbody>
            </table>

            <table>
              <thead>
                <!-- Primer encabezado que ocupa 3 columnas -->
                <tr>
                  <th colspan="3">SUSCEPTIBILITY</th>
                </tr>
                <!-- Segundo encabezado con 3 columnas -->
                <tr>
                  <th>FROM</th>
                  <th>TO</th>
                  <th>TOTAL</th>
                </tr>
              </thead>
              <tbody>
              ${data.wells
        .flatMap(well =>
          (well.receptions ?? []).flatMap(receptions =>
            (receptions.susceptibility ?? []).map(susceptibility => `
                      <tr>
                        <td>${susceptibility.from}</td>
                        <td>${susceptibility.to}</td>
                        <td>${((susceptibility.to ?? 0) - (susceptibility.from ?? 0)).toFixed(2)}</td>
                    
                      </tr>
                    `)
          )
        )
        .join("")}
              </tbody>
            </table>

            <table>
              <thead>
                <!-- Primer encabezado que ocupa 3 columnas -->
                <tr>
                  <th colspan="3">N OF TEST TUBES</th>
                </tr>
                <!-- Segundo encabezado con 3 columnas -->
                <tr>
                  <th>FROM</th>
                  <th>TO</th>
                  <th>TOTAL</th>
                </tr>
              </thead>
              <tbody>
              ${data.wells
        .flatMap(well =>
          (well.receptions ?? []).flatMap(receptions =>
            (receptions.test_tubes_meters ?? []).map(test_tubes_meters => `
                      <tr>
                        <td>${test_tubes_meters.from}</td>
                        <td>${test_tubes_meters.to}</td>
                        <td>${((test_tubes_meters.to ?? 0) - (test_tubes_meters.from ?? 0)).toFixed(2)}</td>
                
                      </tr>
                    `)
          )
        )
        .join("")}
              </tbody>
            </table>

            <table>
              <thead>
                <!-- Primer encabezado que ocupa 3 columnas -->
                <tr>
                  <th colspan="3">METERS</th>
                  <th rowspan="2">OBSERVATIONS</th>
                </tr>
                <!-- Segundo encabezado con 3 columnas -->
                <tr>
                  <th>FROM </th>
                  <th>TO </th>
                  <th>TOTAL</th>
                </tr>
              </thead>
              <tbody>
              ${data.wells
        .flatMap(well =>
          (well.receptions ?? []).flatMap(receptions =>
            (receptions.test_tubes_meters ?? []).map(test_tubes_meters => `
                      <tr>
                        <td>${test_tubes_meters.from_meters}</td>
                        <td>${test_tubes_meters.to_meters}</td>
                        <td>${((test_tubes_meters.to_meters ?? 0) - (test_tubes_meters.from_meters ?? 0)).toFixed(2)}</td>
                        <td>${(well.observations)}</td>
                      </tr>
                    `)
          )
        )
        .join("")}
              </tbody>
            </table>

          </div>
        </td>

        </tr>
        </tbody>
        </table>
            `;


    // Reemplazar el placeholder {{receptions_tables}} con las tablas generadas
    populatedHtml = populatedHtml.replace("{{receptions_tables}}", receptionsHtml);
  } else {
    // Si no hay recepciones, mostrar un mensaje
    populatedHtml = populatedHtml.replace("{{receptions_tables}}", "<p>No reception data available</p>");
  }


  // Generar dinámicamente la tabla de reloggeo
  if (data.wells && data.wells.length > 0) {
    const reloggeoHtml = `
    <div>
      <div>
        <table border="1">
          <thead>
            <tr>
              <th colspan="9">RE-LOGGING DATA</th>
            </tr>
            <tr>
              <th>HOLE</th> <!-- Nueva columna para el nombre del pozo -->
              <th>PRIORITY</th>
              <th>SCHEDULED</th>
              <th>FROM</th>
              <th>TO</th>
              <th>RE-LOGGING</th>
              <th>GEOLOGIST</th>
              <th>DATE</th>
              <th>OBSERVATION</th>
            </tr>
          </thead>
          <tbody>
            ${data.wells
        .flatMap((well) =>
          (well.reloggeo ?? []).map(
            (relog) => `
                  <tr>
                    <td>${well.name}</td> <!-- Nombre del pozo -->
                    <td>${relog.priority}</td>
                    <td>${relog.programed}</td>
                    <td>${relog.from}</td>
                    <td>${relog.to}</td>
                    <td>${relog.relogging}</td>
                    <td>${relog.geologist}</td>
                    <td>${relog.date}</td>
                    <td>${relog.observation}</td>
                  </tr>
                `
          )
        )
        .join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;

    // Reemplazar el placeholder {{reloggeo_tables}} con las tablas generadas
    populatedHtml = populatedHtml.replace("{{reloggeo_tables}}", reloggeoHtml);
  } else {
    // Si no hay datos de reloggeo, mostrar un mensaje
    populatedHtml = populatedHtml.replace(
      "{{reloggeo_tables}}",
      "<p>No hay datos de reloggeo disponibles</p>"
    );
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

    /*const getCurrentDate = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };*/

    const sql = neon(process.env.DATABASE_URL as string);

    const reportInfo = await sql`
      SELECT date as report_date 
      FROM report 
      WHERE id = ${project_id}
      LIMIT 1
    `;

    if (!reportInfo || reportInfo.length === 0) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const report_date = reportInfo[0].report_date;


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
                WHERE rec.well_id = w.id AND rec.date = ${report_date}
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
                WHERE l.well_id = w.id AND l.Date = ${report_date}
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
                WHERE c.well_id = w.id AND c.Date = ${report_date}
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
                WHERE ss.well_id = w.id AND ss.Date = ${report_date}
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
                          'samples', samp.samples
                        )
                      )
                      FROM Sample_Shipment samp
                      WHERE samp.lab_shipment_id = ls.id AND samp.date = ${report_date}
                    )
                  )
                )
                FROM Lab_Shipment ls
                WHERE ls.well_id = w.id
              ),
              'reloggeo', (  -- Nueva sección para Reloggeo
                    SELECT json_agg(
                        json_build_object(
                            'id', rl.id,
                            'priority', rl.priority,
                            'programed', rl.programed,
                            'from', rl."from",
                            'to', rl."to",
                            'relogging', rl.relogging,
                            'geologist', rl.geologist,
                            'date', rl.date,
                            'observation', rl.observation
                        )
                    )
                    FROM Reloggeo rl
                    WHERE rl.well_id = w.id  AND rl.Date = ${report_date} -- Filtrar por well_id
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
        p.id = 3
        AND r.id = ${project_id}
      GROUP BY 
        p.id;
    `;

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const jsonData: ProjectData = result[0].json_data;

    console.log(jsonData);


    const htmlFilePath = path.join(process.cwd(), 'src', 'components', 'pdf', 'template.html');
    let htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
    htmlContent = populateTemplate(htmlContent, jsonData);


    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();


    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0',
    });

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
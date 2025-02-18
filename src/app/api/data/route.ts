import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(req: Request) {
  try {
    // Obtener el project_id de los parámetros de la URL
    const { searchParams } = new URL(req.url);
    const project_id = searchParams.get('project_id');

    // Validar que project_id esté presente
    if (!project_id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    // Conectar a la base de datos usando Neon
    const sql = neon(process.env.DATABASE_URL as string);

    // Ejecutar la consulta SQL para obtener los datos del proyecto y sus relaciones
    const result = await sql`
      SELECT 
        json_build_object(
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
                          json_build_object(
                            'id', sa.id,
                            'subtitle', sa.Subtitle
                          )
                        )
                        FROM safety_talk_subtitle sa
                        WHERE sa.safety_talk_id = s.id
                      )
                    )
                  )
                  FROM safety_talk s
                  WHERE s.report_id = r.id
                ),
                'daily_activities', (
                  SELECT json_agg(
                    json_build_object(
                      'id', d.id,
                      'title', d.Title,
                      'picture', d.Picture,
                      'points', (
                        SELECT json_agg(
                          json_build_object(
                            'id', po.id,
                            'description', po.Description
                          )
                        )
                        FROM point po
                        WHERE po.activity_id = d.id
                      )
                    )
                  )
                  FROM daily_activities d
                  WHERE d.report_id = r.id
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

    // Devolver el resultado en formato JSON
    return NextResponse.json(result[0].json_data);
  } catch (error) {
    console.error("Error fetching project data:", error);

    // Devolver un error en caso de fallo
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
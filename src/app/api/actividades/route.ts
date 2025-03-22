import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { v2 as cloudinary } from 'cloudinary';

// Define el tipo para los subtítulos
interface Subtitle {
    subtitle: string;
}

// Define el tipo para las actividades
interface Activity {
    title: string;
    picture: string;
    subtitles?: Subtitle[];
}

// Configura Cloudinary
cloudinary.config({
    cloud_name: 'dfigfvn5p',
    api_key: '729686827859255',
    api_secret: 'zC4bHIffnTtrHr36qy4zMRep2xk',
});

export async function POST(req: Request) {
    try {
        const data = await req.formData();
        const actividadesJSON = data.get('actividades');
        const reportId = data.get('report_id');
        const image = data.get('picture');

        // Validaciones
        if (!actividadesJSON) {
            return NextResponse.json({ error: "El campo 'actividades' es requerido." }, { status: 400 });
        }

        if (!reportId) {
            return NextResponse.json(
                { error: "El campo 'report_id' es requerido." },
                { status: 400 }
            );
        }

        if (!(image instanceof File)) {
            return NextResponse.json({ error: "La imagen es requerida" }, { status: 400 });
        }

        // Convertir la imagen a buffer
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Subir la imagen a Cloudinary directamente desde el buffer
        const res = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: 'actividades' }, // Opcional: especifica una carpeta en Cloudinary
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            ).end(buffer);
        });

        // Obtener la URL de la imagen subida
        const imageUrl = (res as any).secure_url;

        // Conectar a la base de datos
        const sql = neon(process.env.DATABASE_URL as string);

        // Parsear las actividades
        const { actividades } = JSON.parse(actividadesJSON as string);

        if (actividades.length > 0) {
            console.log("✅ Hay actividades:", actividades);

            // Procesar cada actividad
            await Promise.all(
                actividades.map(async (actividad: Activity) => {
                    try {
                        // Inserta en daily_activities y obtiene el ID
                        const [actividadResult] = await sql`
                            INSERT INTO daily_activities (title, picture, report_id)
                            VALUES (${actividad.title}, ${imageUrl}, ${reportId})
                            RETURNING id;
                        `;

                        console.log(`✅ Actividad insertada con ID: ${actividadResult.id}`);

                        // Si hay subtitles, inserta en point
                        if (actividad.subtitles && actividad.subtitles.length > 0) {
                            await Promise.all(
                                actividad.subtitles.map(async (sub: Subtitle) => {
                                    await sql`
                                        INSERT INTO point (description, activity_id)
                                        VALUES (${sub.subtitle}, ${actividadResult.id});
                                    `;
                                    console.log(`🟢 Subtítulo insertado: ${sub.subtitle}`);
                                })
                            );
                        }
                    } catch (error) {
                        console.error("❌ Error al insertar actividad:", error);
                    }
                })
            );

            return NextResponse.json({ message: "Actividades procesadas correctamente" });
        } else {
            console.log("❌ No hay actividades.");
            return NextResponse.json({ error: "No hay actividades para procesar" }, { status: 400 });
        }
    } catch (error) {
        console.error("Error inserting daily activity:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
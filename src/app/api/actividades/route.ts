import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { v2 as cloudinary } from 'cloudinary';
import { writeFile } from 'fs/promises'
import path from 'path'

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


cloudinary.config({
    cloud_name: 'dfigfvn5p',
    api_key: '729686827859255',
    api_secret: 'zC4bHIffnTtrHr36qy4zMRep2xk' // Click 'View API Keys' above to copy your API secret
});

export async function POST(req: Request) {
    try {

        const data = await req.formData();
        const actividadesJSON = data.get('actividades');
        const reportId = data.get('report_id');

        if (!actividadesJSON) {
            return NextResponse.json({ error: "El campo 'actividades' es requerido." }, { status: 400 });
        }

        const { actividades } = JSON.parse(actividadesJSON as string);

        if (!reportId) {
            return NextResponse.json(
                { error: "El campo 'report_id' es requerido." },
                { status: 400 }
            );
        }

        const image = data.get('picture')

        if (!(image instanceof File)) {
            return NextResponse.json({ error: "La imagen es requerida" }, { status: 400 });
        }

        const bytes = await image.arrayBuffer()

        const buffer = Buffer.from(bytes)

        const filePath = path.join(process.cwd(), 'public', image.name)
        await writeFile(filePath, buffer)

        const res = await cloudinary.uploader.upload(filePath)

        const sql = neon(process.env.DATABASE_URL as string);

        console.log(res.secure_url)


        //primero realizar un map de actividades por JSON y hacer los inserts con la url, tambien hacer uso de RETURNING para que retornen su id, si los subtitles de actividades tiene mas de un elememto entonces realizar otra consulta con un map para cada uno y tomar dicho id de 

        if (actividades.length > 0) {
            console.log("✅ Hay actividades:", actividades);

            await Promise.all(
                actividades.map(async (actividad: Activity) => {
                    try {
                        // Inserta en daily_activities y obtiene el ID
                        const [actividadResult] = await sql`
                INSERT INTO daily_activities (title, picture, report_id)
                VALUES (${actividad.title}, ${res.secure_url}, ${reportId})
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
        }

        return NextResponse.json({
            title: data.get('title'),
            report_id: data.get('report_id'),
            picture: res.secure_url

        });


    } catch (error) {
        console.error("Error inserting daily activity:", error);


        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

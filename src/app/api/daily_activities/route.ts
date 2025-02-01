import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { v2 as cloudinary } from 'cloudinary';
import {writeFile} from 'fs/promises'
import path from 'path'

cloudinary.config({ 
  cloud_name: 'dfigfvn5p', 
  api_key: '729686827859255', 
  api_secret: 'zC4bHIffnTtrHr36qy4zMRep2xk' // Click 'View API Keys' above to copy your API secret
});

export async function POST(req: Request) {
  try {
    
    const data = await req.formData();
    console.log(data.get('title'))
    console.log(data.get('report_id'))
    console.log(data.get('picture'))

    const image = data.get('picture')

    if(!image) {
      return NextResponse.json({ error: "La imagen es requerida" }, { status: 400 });
    }
    
    const bytes = await image.arrayBuffer()

    const buffer = Buffer.from(bytes)

    const  filePath = path.join(process.cwd(),'public',image.name)
    await writeFile(filePath,buffer)

    const res = await cloudinary.uploader.upload(filePath)

  
    const sql = neon(process.env.DATABASE_URL as string);

    console.log(res.secure_url)
   
    await sql`
      INSERT INTO daily_activities (title, picture, report_id) 
      VALUES (${data.get('title')},${res.secure_url} , ${data.get('report_id')})
    `;
    

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

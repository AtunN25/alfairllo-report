import {NextResponse} from 'next/server'
import { neon } from "@neondatabase/serverless";

export async function POST(req: Request) {
    try {
      const { date, overseer, email, project_id } = await req.json();
  
 
      if (!date || !overseer || !email || !project_id) {
        return NextResponse.json({ error: "All fields are required" }, { status: 400 });
      }
  
      const sql = neon(process.env.DATABASE_URL as string);
  
   
      await sql`
        INSERT INTO report (Date, Overseer, Email, project_id) 
        VALUES (${date}, ${overseer}, ${email}, ${project_id})
      `;
  
      return NextResponse.json({ message: "Report added successfully" });
      
    } catch (error) {
      console.error("Error inserting report:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
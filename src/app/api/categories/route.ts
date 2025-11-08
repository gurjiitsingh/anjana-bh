'use server'
import { revalidatePath } from 'next/cache';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(){
   
        // const result = await db.select().from(category)
        // console.log(result)
        // return NextResponse.json({
        //     status: "success",
        //     data: { category: result },
        // });
        return NextResponse.json({"ok":"kk"});
}


export async function DELETE(req: NextRequest) {
    const { id } = await req.json();
   // const { id } = req.body;  
      console.log("Delete api ----", id)
//const result = await db.delete(category).where(eq(category.id, id))
revalidatePath('/admin/categories')

return Response.json({status:"ok"})
}


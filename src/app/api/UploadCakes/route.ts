import { NextResponse } from 'next/server'
import connectdb from "@/app/lib/database"
import cloudinary from '@/app/lib/cloudinary' ///connection to the image database
import Cake from '@/app/lib/modals/CakeCategoriest'


interface CloudinaryResult {
  secure_url: string;
  // Add other properties you might need
  public_id?: string;
  width?: number;
  height?: number;
}

export const POST = async(request: Request)=>{
    try{
        const formData = await request.formData()
        const file: File | null = formData.get('image') as File
        const name = formData.get('name') as string
        const description = formData.get('description') as string
        const category = formData.get('category') as string
        const price = parseFloat(formData.get('price') as string)

         if (!name || !description || !price ||!category) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

        let imageUrl = '';

        if (file) {    //Buffer.from(...) converts that binary into a Node.js Buffer, which is required by Cloudinary’s upload stream.
            const buffer = Buffer.from(await file.arrayBuffer()) //file.arrayBuffer() turns the uploaded file into a binary array (ArrayBuffer).

            const uploadFile = await new Promise <CloudinaryResult> ((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({ folder: 'cakes' }, (error, result) => {
                    if (error) 
                        reject(error)
                    else resolve(result as CloudinaryResult) //type safety 
                    })
                stream.end(buffer)
                })

                imageUrl =  uploadFile.secure_url;
                }
                await connectdb()
                const newCake = await Cake.create({ name, description, price, category, imageUrl })

                return NextResponse.json(newCake, { status: 201 })
            } catch(error: unknown){
                if (error instanceof Error) {
                    return new NextResponse("Error uploading Cakes" + error.message, {status:500})
                }
    }

}
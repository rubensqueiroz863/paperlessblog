import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";
import cloudinary from "@/lib/cloudinary";

interface CloudinaryUploadResult {
  secure_url: string;
  url: string;
  public_id: string;
  format: string;
  bytes: number;
  width: number;
  height: number;
  resource_type: string;
}


export async function POST(req: Request) {
  try {
    // 1️⃣ Token
    const auth = req.headers.get("authorization");
    if (!auth || !auth.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Token não enviado ou inválido" },
        { status: 401 }
      );
    }

    const token = auth.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) throw new Error("JWT_SECRET não definido");

    let payload;
    try {
      ({ payload } = await jwtVerify(token, new TextEncoder().encode(secret)));
    } catch {
      return NextResponse.json(
        { success: false, message: "Token inválido ou expirado" },
        { status: 401 }
      );
    }

    const userId = payload.id as string;

    // 2️⃣ FormData
    const form = await req.formData();

    const name = form.get("name") as string;
    const type = form.get("type") as string;
    const description = form.get("description") as string;
    const file = form.get("file") as File | null;

    if (!name || !type || !description) {
      return NextResponse.json(
        { success: false, message: "Nome, tipo e descrição são obrigatórios" },
        { status: 400 }
      );
    }

    // 3️⃣ Upload Cloudinary
    let imageUrl: string | null = null;

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploaded: CloudinaryUploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "blogs" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result as CloudinaryUploadResult);
          }
        ).end(buffer);
      });

      imageUrl = uploaded.secure_url;
    }

    // 4️⃣ Criar Blog
    const blog = await prisma.blogs.create({
      data: {
        title: name,
        description,
        type,
        image: imageUrl,
        content: "",
        userId,
      },
    });

    return NextResponse.json({ success: true, blog });
  } catch (err) {
    console.error("Erro ao criar blog:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
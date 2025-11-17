import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    // 1️⃣ Pega o token do header
    const auth = req.headers.get("authorization");
    if (!auth || !auth.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Token não enviado ou inválido" },
        { status: 401 }
      );
    }

    const token = auth.split(" ")[1];
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET não definido no ambiente");
    }

    // 2️⃣ Verifica e decodifica o token
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    const userId = payload.id as string;
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "ID do usuário não encontrado no token" },
        { status: 401 }
      );
    }

    // 3️⃣ Busca todos os blogs do usuário
    const blogs = await prisma.blogs.findMany({
      where: { userId },
      orderBy: { created_at: "desc" },
    });

    // 4️⃣ Retorna os blogs
    return NextResponse.json({ success: true, blogs });

  } catch (err) {
    console.error("Erro ao pegar blogs:", err);
    return NextResponse.json(
      { success: false, message: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}

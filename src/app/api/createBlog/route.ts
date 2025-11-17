import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";

export async function POST(req: Request) {
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
    let payload;
    try {
      ({ payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET)));
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Token inválido ou expirado" },
        { status: 401 }
      );
    }

    const userId = payload.id as string;
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "ID do usuário não encontrado no token" },
        { status: 401 }
      );
    }

    // 3️⃣ Pega o body da requisição
    const body = await req.json();
    const { name, type } = body;

    if (!name || !type) {
      return NextResponse.json(
        { success: false, message: "Nome e tipo do blog são obrigatórios" },
        { status: 400 }
      );
    }

    // 4️⃣ Cria o blog no Prisma
    const blog = await prisma.blogs.create({
      data: {
        title: name,
        type: type,
        content: "", // Pode mudar se quiser permitir conteúdo inicial
        userId: userId,
      },
    });

    // 5️⃣ Retorna sucesso
    return NextResponse.json({ success: true, blog });
   } catch (err) {
    // captura qualquer tipo de erro
    console.error("Erro ao criar blog:", err); // log completo no servidor
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

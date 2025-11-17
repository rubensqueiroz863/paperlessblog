import { jwtVerify } from "jose";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");

  if (!auth || !auth.startsWith("Bearer ")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const token = auth.split(" ")[1];

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // Agora você tem os dados do usuário do JWT:
    console.log(payload);

    return Response.json({ user: payload });
  } catch (err) {
    return new Response("Invalid token", { status: 401 });
  }
}
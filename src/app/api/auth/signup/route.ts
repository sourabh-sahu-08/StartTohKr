import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { z } from "zod";

const prisma = new PrismaClient();

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["STARTUP", "GOVERNMENT", "INVESTOR", "INDUSTRY_PARTNER", "MENTOR", "EVALUATOR", "ADMIN"]).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role } = signupSchema.parse(body);

    const isMockDb = process.env.DATABASE_URL?.includes("USER:PASSWORD@HOST");
    if (isMockDb) {
      return new Response(JSON.stringify({ user: { id: "mock-id-123", email, name } }), { status: 201 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), { status: 409 });
    }

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "STARTUP",
      },
    });

    return new Response(JSON.stringify({ user: { id: user.id, email: user.email, name: user.name } }), { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ message: "Invalid input", errors: error.errors }), { status: 400 });
    }
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}

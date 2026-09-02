import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const onboardingSchema = z.object({
  role: z.enum(["STARTUP", "GOVERNMENT", "INVESTOR", "INDUSTRY_PARTNER", "MENTOR", "EVALUATOR"]),
  bio: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const body = await req.json();
    const { role, bio, location, website } = onboardingSchema.parse(body);

    // Update user role
    await prisma.user.update({
      where: { id: session.user.id },
      data: { role },
    });

    // Create or update profile
    await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: { bio, location, website },
      create: {
        userId: session.user.id,
        bio,
        location,
        website,
      },
    });

    return new Response(JSON.stringify({ message: "Onboarding complete" }), { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ message: "Invalid input", errors: error.errors }), { status: 400 });
    }
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Create household and add user as owner in a transaction
    const household = await prisma.household.create({
      data: {
        name,
        description,
        members: {
          create: {
            userId: session.user.id,
            role: "OWNER",
          },
        },
      },
      include: {
        members: true,
      },
    });

    // Create default categories for the household
    await prisma.category.createMany({
      data: [
        // Income categories
        { name: "Salário", type: "INCOME", householdId: household.id, color: "#10b981", icon: "Wallet", isDefault: true },
        { name: "Freelance", type: "INCOME", householdId: household.id, color: "#3b82f6", icon: "Briefcase", isDefault: true },
        { name: "Investimentos", type: "INCOME", householdId: household.id, color: "#8b5cf6", icon: "TrendingUp", isDefault: true },
        { name: "Outras Receitas", type: "INCOME", householdId: household.id, color: "#6366f1", icon: "PiggyBank", isDefault: true },
        // Expense categories
        { name: "Moradia", type: "EXPENSE", householdId: household.id, color: "#ef4444", icon: "Home", isDefault: true },
        { name: "Alimentação", type: "EXPENSE", householdId: household.id, color: "#f59e0b", icon: "Utensils", isDefault: true },
        { name: "Transporte", type: "EXPENSE", householdId: household.id, color: "#06b6d4", icon: "Car", isDefault: true },
        { name: "Saúde", type: "EXPENSE", householdId: household.id, color: "#ec4899", icon: "Heart", isDefault: true },
        { name: "Educação", type: "EXPENSE", householdId: household.id, color: "#8b5cf6", icon: "GraduationCap", isDefault: true },
        { name: "Lazer", type: "EXPENSE", householdId: household.id, color: "#14b8a6", icon: "PartyPopper", isDefault: true },
        { name: "Compras", type: "EXPENSE", householdId: household.id, color: "#f97316", icon: "ShoppingCart", isDefault: true },
        { name: "Outras Despesas", type: "EXPENSE", householdId: household.id, color: "#64748b", icon: "MoreHorizontal", isDefault: true },
      ],
    });

    return NextResponse.json(household, { status: 201 });
  } catch (error) {
    console.error("Error creating household:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const households = await prisma.householdMember.findMany({
      where: { userId: session.user.id },
      include: {
        household: {
          include: {
            _count: {
              select: { members: true, transactions: true },
            },
          },
        },
      },
    });

    return NextResponse.json(households);
  } catch (error) {
    console.error("Error fetching households:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

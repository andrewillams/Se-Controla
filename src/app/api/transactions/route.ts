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
    const {
      description,
      amount,
      type,
      frequency,
      date,
      isPaid,
      notes,
      categoryId,
      householdId,
      userId,
    } = body;

    // Validate required fields
    if (!description || !amount || !type || !frequency || !date || !categoryId || !householdId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify user is member of household
    const membership = await prisma.householdMember.findFirst({
      where: {
        householdId,
        userId: session.user.id,
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "Not a member of this household" }, { status: 403 });
    }

    const transaction = await prisma.transaction.create({
      data: {
        description,
        amount,
        type,
        frequency,
        date: new Date(date),
        isPaid: isPaid ?? true,
        notes: notes || null,
        categoryId,
        householdId,
        userId: session.user.id,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const householdId = searchParams.get("householdId");

    if (!householdId) {
      return NextResponse.json({ error: "householdId is required" }, { status: 400 });
    }

    // Verify user is member of household
    const membership = await prisma.householdMember.findFirst({
      where: {
        householdId,
        userId: session.user.id,
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "Not a member of this household" }, { status: 403 });
    }

    const transactions = await prisma.transaction.findMany({
      where: { householdId },
      include: {
        category: true,
        user: true,
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

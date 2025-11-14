import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    } = body;

    // Verify transaction exists and user has access
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id: params.id },
      include: {
        household: {
          include: {
            members: {
              where: { userId: session.user.id },
            },
          },
        },
      },
    });

    if (!existingTransaction || existingTransaction.household.members.length === 0) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    const transaction = await prisma.transaction.update({
      where: { id: params.id },
      data: {
        description,
        amount,
        type,
        frequency,
        date: new Date(date),
        isPaid,
        notes: notes || null,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify transaction exists and user has access
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id: params.id },
      include: {
        household: {
          include: {
            members: {
              where: { userId: session.user.id },
            },
          },
        },
      },
    });

    if (!existingTransaction || existingTransaction.household.members.length === 0) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    await prisma.transaction.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

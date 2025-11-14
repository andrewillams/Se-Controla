import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TransactionForm } from "@/components/dashboard/transaction-form";

export default async function EditTransactionPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const transaction = await prisma.transaction.findUnique({
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

  if (!transaction || transaction.household.members.length === 0) {
    redirect("/dashboard/transactions");
  }

  const categories = await prisma.category.findMany({
    where: { householdId: transaction.householdId },
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Editar Transação</h1>
        <p className="text-muted-foreground">
          Atualize as informações da transação
        </p>
      </div>

      <TransactionForm
        householdId={transaction.householdId}
        userId={session.user.id}
        categories={categories}
        initialData={{
          id: transaction.id,
          description: transaction.description,
          amount: transaction.amount.toString(),
          type: transaction.type,
          frequency: transaction.frequency,
          date: transaction.date.toISOString().split("T")[0],
          isPaid: transaction.isPaid,
          notes: transaction.notes,
          categoryId: transaction.categoryId,
        }}
      />
    </div>
  );
}

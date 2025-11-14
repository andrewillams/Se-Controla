import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TransactionForm } from "@/components/dashboard/transaction-form";

export default async function NewTransactionPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Get user's first household
  const userHouseholds = await prisma.householdMember.findMany({
    where: { userId: session.user.id },
    include: { household: true },
  });

  if (userHouseholds.length === 0) {
    redirect("/dashboard/households");
  }

  const currentHousehold = userHouseholds[0].household;

  // Get categories for this household
  const categories = await prisma.category.findMany({
    where: { householdId: currentHousehold.id },
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Nova Transação</h1>
        <p className="text-muted-foreground">
          Adicione uma nova receita ou despesa para {currentHousehold.name}
        </p>
      </div>

      <TransactionForm
        householdId={currentHousehold.id}
        userId={session.user.id}
        categories={categories}
      />
    </div>
  );
}

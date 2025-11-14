import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowUpCircle, ArrowDownCircle, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { TransactionItem } from "@/components/dashboard/transaction-item";

export default async function TransactionsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Get user's first household (we'll add household selector later)
  const userHouseholds = await prisma.householdMember.findMany({
    where: { userId: session.user.id },
    include: { household: true },
  });

  if (userHouseholds.length === 0) {
    redirect("/dashboard/households");
  }

  const currentHousehold = userHouseholds[0].household;

  // Get all transactions for the household
  const transactions = await prisma.transaction.findMany({
    where: { householdId: currentHousehold.id },
    include: {
      category: true,
      user: true,
    },
    orderBy: { date: "desc" },
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Transações</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {currentHousehold.name}
          </p>
        </div>
        <Link href="/dashboard/transactions/new" className="w-full sm:w-auto">
          <Button size="lg" className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Nova Transação
          </Button>
        </Link>
      </div>

      {transactions.length === 0 ? (
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Nenhuma transação encontrada</CardTitle>
            <CardDescription>
              Comece adicionando sua primeira receita ou despesa
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Link href="/dashboard/transactions/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Transação
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            {transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

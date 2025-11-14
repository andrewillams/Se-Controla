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
import { DeleteTransactionButton } from "@/components/dashboard/delete-transaction-button";

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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transações</h1>
          <p className="text-muted-foreground">
            {currentHousehold.name} - Todas as movimentações
          </p>
        </div>
        <Link href="/dashboard/transactions/new">
          <Button size="lg" className="gap-2">
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
            <div className="divide-y">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="p-4 hover:bg-muted/50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-full ${
                        transaction.type === "INCOME"
                          ? "bg-success/10 text-success"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {transaction.type === "INCOME" ? (
                        <ArrowUpCircle className="h-5 w-5" />
                      ) : (
                        <ArrowDownCircle className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-lg">{transaction.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className="text-xs"
                          style={{
                            borderColor: transaction.category.color,
                            color: transaction.category.color,
                          }}
                        >
                          {transaction.category.name}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {transaction.frequency === "FIXED"
                            ? "Fixa"
                            : transaction.frequency === "VARIABLE"
                            ? "Variável"
                            : "Esporádica"}
                        </Badge>
                        {!transaction.isPaid && (
                          <Badge variant="warning" className="text-xs">
                            Pendente
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatDate(transaction.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p
                        className={`font-bold text-xl ${
                          transaction.type === "INCOME" ? "text-success" : "text-destructive"
                        }`}
                      >
                        {transaction.type === "INCOME" ? "+" : "-"}
                        {formatCurrency(Number(transaction.amount))}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/transactions/${transaction.id}/edit`}>
                        <Button size="icon" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <DeleteTransactionButton transactionId={transaction.id} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

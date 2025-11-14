"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpCircle, ArrowDownCircle, Edit } from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DeleteTransactionButton } from "./delete-transaction-button";

type Transaction = {
  id: string;
  description: string;
  amount: any;
  type: "INCOME" | "EXPENSE";
  frequency: "FIXED" | "VARIABLE" | "SPORADIC";
  date: Date;
  isPaid: boolean;
  category: {
    name: string;
    color: string;
  };
};

export function TransactionItem({ transaction }: { transaction: Transaction }) {
  return (
    <div className="p-4 hover:bg-muted/50 transition-colors border-b last:border-0">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={`p-2 sm:p-3 rounded-full flex-shrink-0 ${
            transaction.type === "INCOME"
              ? "bg-success/10 text-success"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {transaction.type === "INCOME" ? (
            <ArrowUpCircle className="h-4 w-4 sm:h-5 sm:w-5" />
          ) : (
            <ArrowDownCircle className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm sm:text-lg truncate">
                {transaction.description}
              </p>
              <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
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
              </div>
              <p className="text-xs text-muted-foreground mt-1 sm:hidden">
                {formatDate(transaction.date)}
              </p>
            </div>

            {/* Amount - Desktop */}
            <div className="hidden sm:flex flex-col items-end gap-2">
              <p
                className={`font-bold text-xl ${
                  transaction.type === "INCOME" ? "text-success" : "text-destructive"
                }`}
              >
                {transaction.type === "INCOME" ? "+" : "-"}
                {formatCurrency(Number(transaction.amount))}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(transaction.date)}
              </p>
            </div>
          </div>

          {/* Amount and Actions - Mobile */}
          <div className="flex items-center justify-between mt-3 sm:hidden">
            <p
              className={`font-bold text-lg ${
                transaction.type === "INCOME" ? "text-success" : "text-destructive"
              }`}
            >
              {transaction.type === "INCOME" ? "+" : "-"}
              {formatCurrency(Number(transaction.amount))}
            </p>
            <div className="flex gap-1">
              <Link href={`/dashboard/transactions/${transaction.id}/edit`}>
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <Edit className="h-3 w-3" />
                </Button>
              </Link>
              <DeleteTransactionButton transactionId={transaction.id} />
            </div>
          </div>
        </div>

        {/* Actions - Desktop */}
        <div className="hidden sm:flex gap-2 flex-shrink-0">
          <Link href={`/dashboard/transactions/${transaction.id}/edit`}>
            <Button size="icon" variant="ghost">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <DeleteTransactionButton transactionId={transaction.id} />
        </div>
      </div>
    </div>
  );
}

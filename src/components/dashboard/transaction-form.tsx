"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Category = {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
  color: string;
};

type TransactionFormProps = {
  householdId: string;
  userId: string;
  categories: Category[];
  initialData?: {
    id: string;
    description: string;
    amount: string;
    type: "INCOME" | "EXPENSE";
    frequency: "FIXED" | "VARIABLE" | "SPORADIC";
    date: string;
    isPaid: boolean;
    notes: string | null;
    categoryId: string;
  };
};

export function TransactionForm({
  householdId,
  userId,
  categories,
  initialData,
}: TransactionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: initialData?.description || "",
    amount: initialData?.amount || "",
    type: initialData?.type || ("EXPENSE" as "INCOME" | "EXPENSE"),
    frequency: initialData?.frequency || ("FIXED" as "FIXED" | "VARIABLE" | "SPORADIC"),
    date: initialData?.date || new Date().toISOString().split("T")[0],
    isPaid: initialData?.isPaid ?? true,
    notes: initialData?.notes || "",
    categoryId: initialData?.categoryId || "",
  });

  const filteredCategories = categories.filter((c) => c.type === formData.type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = initialData
        ? `/api/transactions/${initialData.id}`
        : "/api/transactions";
      const method = initialData ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          householdId,
          userId,
        }),
      });

      if (!response.ok) throw new Error("Erro ao salvar transação");

      router.push("/dashboard/transactions");
      router.refresh();
    } catch (error) {
      console.error("Error saving transaction:", error);
      alert("Erro ao salvar transação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/transactions">
              <Button type="button" variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <CardTitle>{initialData ? "Editar" : "Nova"} Transação</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "INCOME" | "EXPENSE") => {
                  setFormData({ ...formData, type: value, categoryId: "" });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INCOME">Receita</SelectItem>
                  <SelectItem value="EXPENSE">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Frequência *</Label>
              <Select
                value={formData.frequency}
                onValueChange={(value: "FIXED" | "VARIABLE" | "SPORADIC") =>
                  setFormData({ ...formData, frequency: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FIXED">Fixa</SelectItem>
                  <SelectItem value="VARIABLE">Variável</SelectItem>
                  <SelectItem value="SPORADIC">Esporádica</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Input
              id="description"
              placeholder="Ex: Salário, Aluguel, Supermercado..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Data *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Categoria *</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="isPaid">Status de Pagamento</Label>
            <Select
              value={formData.isPaid ? "paid" : "pending"}
              onValueChange={(value) =>
                setFormData({ ...formData, isPaid: value === "paid" })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">Pago</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              placeholder="Adicione detalhes adicionais..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="flex gap-4">
            <Link href="/dashboard/transactions" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading || !formData.description || !formData.amount || !formData.categoryId}
            >
              {loading ? "Salvando..." : initialData ? "Atualizar" : "Criar"} Transação
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Crown, Shield, User } from "lucide-react";
import Link from "next/link";
import { CreateHouseholdDialog } from "@/components/dashboard/create-household-dialog";

export default async function HouseholdsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const userHouseholds = await prisma.householdMember.findMany({
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
    orderBy: { joinedAt: "desc" },
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "OWNER":
        return <Crown className="h-4 w-4" />;
      case "ADMIN":
        return <Shield className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "OWNER":
        return "Proprietário";
      case "ADMIN":
        return "Administrador";
      default:
        return "Membro";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Minhas Casas</h1>
          <p className="text-muted-foreground">
            Gerencie seus espaços de orçamento individual ou familiar
          </p>
        </div>
        <CreateHouseholdDialog userId={session.user.id} />
      </div>

      {userHouseholds.length === 0 ? (
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle>Nenhuma casa encontrada</CardTitle>
            <CardDescription>
              Crie sua primeira casa para começar a gerenciar seu orçamento
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <CreateHouseholdDialog userId={session.user.id} />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userHouseholds.map((membership) => (
            <Card key={membership.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl">{membership.household.name}</CardTitle>
                  </div>
                  <Badge variant="outline" className="gap-1">
                    {getRoleIcon(membership.role)}
                    {getRoleLabel(membership.role)}
                  </Badge>
                </div>
                {membership.household.description && (
                  <CardDescription>{membership.household.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Membros</span>
                  <span className="font-medium">{membership.household._count.members}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transações</span>
                  <span className="font-medium">{membership.household._count.transactions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Entrou em</span>
                  <span className="font-medium">
                    {new Date(membership.joinedAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Link href={`/dashboard/households/${membership.householdId}`} className="flex-1">
                    <Button className="w-full">Visualizar</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

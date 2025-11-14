import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, BarChart3, Calendar, Users, Wallet } from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">Se Controla</h1>
          </div>
          <Link href="/auth/signin">
            <Button>Entrar</Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
          Controle Financeiro <br />
          <span className="text-primary">Simples e Inteligente</span>
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Gerencie suas receitas e despesas, compartilhe com sua família e tenha
          controle total sobre seu orçamento
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/signin">
            <Button size="lg" className="gap-2">
              Começar Agora <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <BarChart3 className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Dashboard Completo</CardTitle>
              <CardDescription>
                Visualize suas finanças com gráficos e relatórios detalhados
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Wallet className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Gestão Inteligente</CardTitle>
              <CardDescription>
                Categorize despesas fixas, variáveis e esporádicas automaticamente
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Calendar className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Integração Calendar</CardTitle>
              <CardDescription>
                Sincronize contas pendentes com seu Google Calendar
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Compartilhamento</CardTitle>
              <CardDescription>
                Gerencie orçamento individual ou familiar em tempo real
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Card className="max-w-2xl mx-auto bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-3xl">Pronto para começar?</CardTitle>
            <CardDescription className="text-primary-foreground/80 text-lg">
              Crie sua conta gratuitamente com o Google e comece a organizar suas
              finanças agora mesmo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/auth/signin">
              <Button size="lg" variant="secondary" className="gap-2">
                Criar Conta Grátis <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
        <p>© 2024 Se Controla. Desenvolvido com ❤️</p>
      </footer>
    </div>
  );
}

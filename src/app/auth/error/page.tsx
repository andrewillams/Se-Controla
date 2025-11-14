"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle>Erro na Autenticação</CardTitle>
          <CardDescription>
            {error === "Configuration"
              ? "Há um problema na configuração do servidor."
              : error === "AccessDenied"
              ? "Você negou o acesso à aplicação."
              : error === "Verification"
              ? "O token de verificação expirou ou já foi usado."
              : "Ocorreu um erro ao tentar fazer login. Por favor, tente novamente."}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link href="/auth/signin">
            <Button>Tentar Novamente</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

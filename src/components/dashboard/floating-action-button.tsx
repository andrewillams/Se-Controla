"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FloatingActionButton() {
  return (
    <div className="fixed bottom-6 right-6 z-40 md:hidden">
      <Link href="/dashboard/transactions/new">
        <Button
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  );
}

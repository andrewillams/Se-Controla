import { Navbar } from "@/components/dashboard/navbar";
import { FloatingActionButton } from "@/components/dashboard/floating-action-button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="container mx-auto px-4 py-6 sm:py-8 pb-24 sm:pb-8">{children}</main>
      <FloatingActionButton />
    </div>
  );
}

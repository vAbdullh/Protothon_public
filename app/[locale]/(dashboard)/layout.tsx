import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

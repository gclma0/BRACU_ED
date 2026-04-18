import { auth } from "@/auth";
import DashboardSidebar from "@/components/dashboard-sidebar";
import { redirect } from "next/navigation";
import React from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-svh">
      <div className="hidden lg:block">
        <DashboardSidebar />
      </div>
      <div className="flex-1 lg:ml-64">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

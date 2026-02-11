"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { useI18n } from "@/lib/i18n"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { locale } = useI18n()

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div
        className={`transition-all duration-200 ${
          locale === "ar" ? "lg:mr-64" : "lg:ml-64"
        }`}
      >
        <DashboardHeader />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import Notifications from "@/components/notifications"; // Import komponen notifikasi

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const userRole = Cookies.get("user_role");

  const handleLogout = () => {
    Cookies.remove("auth_token");
    Cookies.remove("user_role");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 md:px-8 flex h-16 items-center justify-between">
          <Link href="/dashboard" className="text-xl font-bold">
            Rembug Warga
          </Link>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link href="/dashboard/invoices">Tagihan Saya</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/dashboard/laporan-bulanan">Laporan Bulanan</Link>
            </Button>
            <Button asChild variant="ghost">
                  <Link href="/dashboard/logbook">Logbook Keuangan</Link>
                </Button>
            {userRole === "pengurus" && (
              <Button asChild variant="ghost">
                <Link href="/admin/dashboard">Admin Panel</Link>
              </Button>
            )}
            <Notifications />
            <Button onClick={handleLogout} variant="destructive">
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 md:px-8 py-6">{children}</main>
    </div>
  );
}

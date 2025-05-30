import { Navbar } from "@/components/admin/navbar";
import Sidebar from "@/components/admin/sidebar";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex pt-16  ">
        <Sidebar />
        <main className="flex-1 ml-96">{children}</main>
      </div>
    </div>
  );
}

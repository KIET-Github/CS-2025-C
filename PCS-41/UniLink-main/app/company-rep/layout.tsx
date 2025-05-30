import Sidebar from "@/components/company-rep/sidebar";
import { Navbar } from "@/components/institution-admin/navbar";

export default function CompanyRepLayout({
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

import AdminDashboard from "@/components/admin/AdminDashboard";
import Header from "@/components/layout/Header";

export default function AdminPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AdminDashboard />
        </div>
      </main>
    </>
  );
}

import { getCurrentAdmin } from "@/lib/auth";
import AdminSidebar from "./_components/AdminSidebar";

export default async function AdminLayout({ children }) {
  const admin = await getCurrentAdmin();
  if (!admin) return children;
  return (
    <div className="admin-grid">
      <AdminSidebar />
      <section className="admin-main">{children}</section>
    </div>
  );
}

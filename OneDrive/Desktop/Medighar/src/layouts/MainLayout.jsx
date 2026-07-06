import { Outlet } from "react-router-dom";
import Navbar from "@/shared/components/common/Navbar.jsx";

function MainLayout() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <Outlet />
    </main>
  );
}

export default MainLayout;

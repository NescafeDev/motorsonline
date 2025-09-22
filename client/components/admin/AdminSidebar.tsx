import React from "react";
import { useNavigate } from "react-router-dom";

interface AdminSidebarProps {
  active: "blog" | "adds";
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ active }) => {
  const navigate = useNavigate();
  return (
    <aside className="w-64 bg-white border-r flex flex-col p-6">
      <h2 className="text-2xl font-bold mb-8">Admin paneel</h2>
      <nav className="flex flex-col gap-4">
        <button
          className={`text-left px-4 py-2 rounded hover:bg-gray-100 font-semibold ${active === "blog" ? "bg-brand-primary text-white" : ""}`}
          onClick={() => navigate("/admin/blog")}
        >
          Blogid
        </button>
        <button
          className={`text-left px-4 py-2 rounded hover:bg-gray-100 font-semibold ${active === "adds" ? "bg-brand-primary text-white" : ""}`}
          onClick={() => navigate("/admin/adds")}
        >
          Adds
        </button>
      </nav>
    </aside>
  );
};

export default AdminSidebar; 
import React from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";

interface AdminSidebarProps {
  active: "blog" | "adds" | "privacy" | "terms" | "bannerimages";
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ active }) => {
  const navigate = useNavigate();
  const { currentLanguage } = useI18n();
  
  return (
    <aside className="w-64 bg-white border-r flex flex-col p-6">
      <h2 className="text-2xl font-bold mb-8">Admin paneel</h2>
      <nav className="flex flex-col gap-4">
        <button
          className={`text-left px-4 py-2 rounded hover:bg-gray-100 font-semibold ${active === "blog" ? "bg-brand-primary text-white" : ""}`}
          onClick={() => navigate(`/${currentLanguage}/admin/blog`)}
        >
          Blogid
        </button>
        <button
          className={`text-left px-4 py-2 rounded hover:bg-gray-100 font-semibold ${active === "bannerimages" ? "bg-brand-primary text-white" : ""}`}
          onClick={() => navigate(`/${currentLanguage}/admin/bannerimages`)}
        >
          Bännerpildid
        </button>
        <button
          className={`text-left px-4 py-2 rounded hover:bg-gray-100 font-semibold ${active === "adds" ? "bg-brand-primary text-white" : ""}`}
          onClick={() => navigate(`/${currentLanguage}/admin/adds`)}
        >
          Adds
        </button>
        <button
          className={`text-left px-4 py-2 rounded hover:bg-gray-100 font-semibold ${active === "privacy" ? "bg-brand-primary text-white" : ""}`}
          onClick={() => navigate(`/${currentLanguage}/admin/privacy`)}
        >
          Privaatsuspoliitika
        </button>
        <button
          className={`text-left px-4 py-2 rounded hover:bg-gray-100 font-semibold ${active === "terms" ? "bg-brand-primary text-white" : ""}`}
          onClick={() => navigate(`/${currentLanguage}/admin/terms`)}
        >
          Teenusetingimused
        </button>
      </nav>
    </aside>
  );
};

export default AdminSidebar; 
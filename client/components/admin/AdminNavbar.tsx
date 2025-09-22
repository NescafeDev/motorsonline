import React from "react";

interface AdminNavbarProps {
  admin: { name: string } | null;
  handleLogout: () => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ admin, handleLogout }) => (
  <nav className="w-full flex items-center justify-between px-8 py-4 bg-white border-b shadow-sm">
    <div className="flex items-center gap-2">
      <img src="/img/logo.svg" alt="Logo" className="h-8 w-auto" />
    </div>
    <div className="flex items-center gap-4">
      {admin && <span className="font-semibold text-brand-primary">{admin.name}</span>}
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded font-semibold hover:bg-red-600 transition"
      >
        Logi välja
      </button>
    </div>
  </nav>
);

export default AdminNavbar; 
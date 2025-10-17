import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import dynamic from "react-quill";
import "react-quill/dist/quill.snow.css";
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useI18n } from "@/contexts/I18nContext";
import axios from 'axios';

const ReactQuill = dynamic;

export default function AdminPrivacyPanel() {
  const navigate = useNavigate();
  const { currentLanguage } = useI18n();
  const [content, setContent] = useState('');
  const [admin, setAdmin] = useState<{ name: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate(`/${currentLanguage}/admin`);
      return;
    }
    try {
      const parsed = JSON.parse(user);
      if (!parsed.admin) {
        navigate(`/${currentLanguage}/admin`);
        return;
      }
      setAdmin(parsed);
    } catch {
      navigate(`/${currentLanguage}/admin`);
      return;
    }
  }, [navigate, currentLanguage]);

  // Load existing privacy content
  useEffect(() => {
    const loadPrivacyContent = async () => {
      try {
        const response = await axios.get("/api/privacy");
        if (response.data.privacy) {
          setContent(response.data.privacy);
        }
      } catch (error) {
        console.error("Error loading privacy content:", error);
      }
    };

    if (admin) {
      loadPrivacyContent();
    }
  }, [admin]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate(`/${currentLanguage}/admin`);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      console.log("Saving privacy content...", content);
      await axios.post("/api/privacy", { content });
      alert("Privaatsuspoliitika sisu salvestatud edukalt!");
    } catch (error) {
      console.error("Error saving privacy content:", error);
      alert("Viga privaatsuspoliitika sisu salvestamisel!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Admin Navbar */}
      <AdminNavbar admin={admin} handleLogout={handleLogout} />
      <div className="flex w-full">
        {/* Sidebar */}
        <AdminSidebar active="privacy" />
        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Privaatsuspoliitika</h1>
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-brand-primary text-white px-4 py-2 rounded font-semibold hover:bg-brand-primary/90 disabled:opacity-50"
            >
              {loading ? "Salvestamine..." : "Salvesta"}
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div>
              <label className="block mb-2 font-semibold">Sisu</label>
              <ReactQuill 
                theme="snow" 
                value={content} 
                onChange={setContent}
                style={{ height: '500px' }}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
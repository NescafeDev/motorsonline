import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useI18n } from "@/contexts/I18nContext";

interface BannerImage {
  id: number;
  desktop_image: string;
  mobile_image: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

const defaultForm: Omit<BannerImage, "id" | "created_at" | "updated_at"> = {
  desktop_image: "",
  mobile_image: "",
  active: true,
};

export default function AdminBannerImagesPanel() {
  const navigate = useNavigate();
  const { t, currentLanguage } = useI18n();
  const [bannerImages, setBannerImages] = useState<BannerImage[]>([]);
  const [editing, setEditing] = useState<BannerImage | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<Omit<BannerImage, "id" | "created_at" | "updated_at">>(defaultForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [admin, setAdmin] = useState<{ name: string } | null>(null);
  const [formFiles, setFormFiles] = useState<{ desktop_image: File | null, mobile_image: File | null }>({ 
    desktop_image: null, 
    mobile_image: null 
  });

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
    fetchBannerImages();
    // eslint-disable-next-line
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate(`/${currentLanguage}/admin`);
  };

  const fetchBannerImages = async () => {
    const res = await fetch("/api/banner-images");
    const data = await res.json();
    setBannerImages(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleEdit = (bannerImage: BannerImage) => {
    setEditing(bannerImage);
    setForm({ 
      desktop_image: bannerImage.desktop_image,
      mobile_image: bannerImage.mobile_image,
      active: bannerImage.active
    });
    setFormFiles({ desktop_image: null, mobile_image: null });
    setModalOpen(true);
  };

  const handleToggleActive = async (id: number) => {
    try {
      const res = await fetch(`/api/banner-images/${id}/toggle`, {
        method: "PATCH",
        headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
      });
      if (res.ok) {
        fetchBannerImages();
      }
    } catch (error) {
      console.error("Error toggling banner image:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Kustuta see bännerpilt?")) return;
    await fetch(`/api/banner-images/${id}`, {
      method: "DELETE",
      headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
    });
    fetchBannerImages();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const method = editing ? "PUT" : "POST";
      const url = editing ? `/api/banner-images/${editing.id}` : "/api/banner-images";
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
      if (formFiles.desktop_image) formData.append("desktop_image", formFiles.desktop_image);
      if (formFiles.mobile_image) formData.append("mobile_image", formFiles.mobile_image);
      
      const res = await fetch(url, {
        method,
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Viga salvestamisel.");
      } else {
        setEditing(null);
        setForm(defaultForm);
        setFormFiles({ desktop_image: null, mobile_image: null });
        setModalOpen(false);
        fetchBannerImages();
      }
    } catch {
      setError(t('auth.networkErrorTryLater'));
    } finally {
      setLoading(false);
    }
  };

  const filteredBannerImages = bannerImages.filter(bannerImage =>
    bannerImage.desktop_image.toLowerCase().includes(search.toLowerCase()) ||
    bannerImage.mobile_image.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Admin Navbar */}
      <AdminNavbar admin={admin} handleLogout={handleLogout} />
      <div className="flex w-full">
        {/* Sidebar */}
        <AdminSidebar active="bannerimages" />
        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Otsi bännerpilti..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="border rounded px-3 py-2 w-64"
              />
            </div>
            <button
              className="bg-brand-primary text-white px-4 py-2 rounded font-semibold"
              onClick={() => { setEditing(null); setForm(defaultForm); setModalOpen(true); }}
            >
              Lisa bännerpilt
            </button>
          </div>
          {/* Banner Images Table */}
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Desktop pilt</th>
                  <th className="px-4 py-2 text-left">Mobile pilt</th>
                  {/* <th className="px-4 py-2 text-left">Staatus</th>
                  <th className="px-4 py-2 text-left">Loodud</th> */}
                  <th className="px-4 py-2 text-left">Toimingud</th>
                </tr>
              </thead>
              <tbody>
                {filteredBannerImages.map(bannerImage => (
                  <tr key={bannerImage.id} className="border-b items-center text-center">
                    <td className="px-4 py-2">
                      {bannerImage.desktop_image && (
                        <img 
                          src={bannerImage.desktop_image} 
                          alt="Desktop" 
                          className="h-40 w-80 object-cover rounded"
                        />
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {bannerImage.mobile_image && (
                        <img 
                          src={bannerImage.mobile_image} 
                          alt="Mobile" 
                          className="h-40 w-80 object-cover rounded"
                        />
                      )}
                    </td>
                    {/* <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        bannerImage.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {bannerImage.active ? 'Aktiivne' : 'Peidetud'}
                      </span>
                    </td>
                    <td className="px-4 py-2">{new Date(bannerImage.created_at).toLocaleDateString()}</td> */}
                     <td className="px-4 py-2">
                       <div className="flex gap-3">
                         <button 
                           className={`px-6 py-3 rounded-lg text-base ${
                             bannerImage.active 
                               ? 'bg-red-500 text-white' 
                               : 'bg-green-500 text-white'
                           }`}
                           onClick={() => handleToggleActive(bannerImage.id)}
                         >
                           {bannerImage.active ? 'Peida' : 'Näita'}
                         </button>
                         <button 
                           className="bg-blue-500 text-white px-6 py-3 rounded-lg text-base" 
                           onClick={() => handleEdit(bannerImage)}
                         >
                           Muuda
                         </button>
                         <button 
                           className="bg-red-500 text-white px-6 py-3 rounded-lg text-base" 
                           onClick={() => handleDelete(bannerImage.id)}
                         >
                           Kustuta
                         </button>
                       </div>
                     </td>
                  </tr>
                ))}
                {filteredBannerImages.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-400">Bännerpilti ei leitud.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Modal for Create/Update */}
          {modalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded shadow-lg w-full max-w-4xl relative max-h-[90%] overflow-y-scroll">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl"
                  onClick={() => setModalOpen(false)}
                >
                  &times;
                </button>
                <h2 className="text-xl font-semibold mb-4">{editing ? "Muuda bännerpilti" : "Lisa bännerpilt"}</h2>
                {error && <div className="text-red-600 mb-2">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 font-semibold">Desktop pilt</label>
                      <input 
                        name="desktop_image" 
                        type="file" 
                        accept="image/*" 
                        onChange={e => setFormFiles(f => ({ ...f, desktop_image: e.target.files?.[0] || null }))} 
                        className="border rounded px-3 py-2 w-full" 
                      />
                      {/* Show existing image when editing */}
                      {editing && form.desktop_image && !formFiles.desktop_image && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-1">Praegune pilt:</p>
                          <img src={form.desktop_image} alt="desktop" className="h-32 w-40 object-cover rounded border" />
                        </div>
                      )}
                      {/* Show new selected image thumbnail */}
                      {formFiles.desktop_image && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-1">Uus pilt:</p>
                          <img 
                            src={URL.createObjectURL(formFiles.desktop_image)} 
                            alt="desktop preview" 
                            className="h-32 w-40 object-cover rounded border" 
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block mb-1 font-semibold">Mobile pilt</label>
                      <input 
                        name="mobile_image" 
                        type="file" 
                        accept="image/*" 
                        onChange={e => setFormFiles(f => ({ ...f, mobile_image: e.target.files?.[0] || null }))} 
                        className="border rounded px-3 py-2 w-full" 
                      />
                      {/* Show existing image when editing */}
                      {editing && form.mobile_image && !formFiles.mobile_image && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-1">Praegune pilt:</p>
                          <img src={form.mobile_image} alt="mobile" className="h-32 w-40 object-cover rounded border" />
                        </div>
                      )}
                      {/* Show new selected image thumbnail */}
                      {formFiles.mobile_image && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-1">Uus pilt:</p>
                          <img 
                            src={URL.createObjectURL(formFiles.mobile_image)} 
                            alt="mobile preview" 
                            className="h-32 w-40 object-cover rounded border" 
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      name="active" 
                      checked={form.active} 
                      onChange={handleChange}
                      className="rounded"
                    />
                    <label className="font-semibold">Aktiivne</label>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      type="submit" 
                      className="bg-brand-primary text-white px-4 py-2 rounded font-semibold" 
                      disabled={loading}
                    >
                      {editing ? "Salvesta muudatused" : "Lisa bännerpilt"}
                    </button>
                    <button 
                      type="button" 
                      className="bg-gray-300 px-4 py-2 rounded" 
                      onClick={() => setModalOpen(false)}
                    >
                      Tühista
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

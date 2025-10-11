import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dynamic from "react-quill";
import "react-quill/dist/quill.snow.css";
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useI18n } from "@/contexts/I18nContext";

interface Blog {
  id: number;
  category: string;
  title: string;
  title_image: string;
  author: string;
  published: string;
  introduction: string;
  intro_image: string;
  summary: string;
  intro_detail?: string;
}

const defaultForm: Omit<Blog, "id"> = {
  category: "",
  title: "",
  title_image: "",
  author: "",
  published: new Date().toISOString().slice(0, 19),
  introduction: "",
  intro_image: "",
  summary: "",
  intro_detail: "",
};

const ReactQuill = dynamic;

export default function AdminBlogPanel() {
  const navigate = useNavigate();
  const { t , currentLanguage } = useI18n();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<Omit<Blog, "id">>(defaultForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [admin, setAdmin] = useState<{ name: string } | null>(null);
  const [formFiles, setFormFiles] = useState<{ title_image: File | null, intro_image: File | null }>({ title_image: null, intro_image: null });

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
    fetchBlogs();
    // eslint-disable-next-line
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate(`/${currentLanguage}/admin`);
  };

  const fetchBlogs = async () => {
    const res = await fetch("/api/blogs");
    const data = await res.json();
    setBlogs(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuillChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (blog: Blog) => {
    setEditing(blog);
    setForm({ ...blog });
    setFormFiles({ title_image: null, intro_image: null });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Kustuta see blogi?")) return;
    await fetch(`/api/blogs/${id}`, {
      method: "DELETE",
      headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
    });
    fetchBlogs();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("handleSubmit");
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const method = editing ? "PUT" : "POST";
      const url = editing ? `/api/blogs/${editing.id}` : "/api/blogs";
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (formFiles.title_image) formData.append("title_image", formFiles.title_image);
      if (formFiles.intro_image) formData.append("intro_image", formFiles.intro_image);
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
        setFormFiles({ title_image: null, intro_image: null });
        setModalOpen(false);
        fetchBlogs();
      }
    } catch {
      setError(t('auth.networkErrorTryLater'));
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(search.toLowerCase()) ||
    blog.category.toLowerCase().includes(search.toLowerCase()) ||
    blog.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Admin Navbar */}
      <AdminNavbar admin={admin} handleLogout={handleLogout} />
      <div className="flex w-full">
        {/* Sidebar */}
        <AdminSidebar active="blog" />
        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Otsi blogi..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="border rounded px-3 py-2 w-64"
              />
            </div>
            <button
              className="bg-brand-primary text-white px-4 py-2 rounded font-semibold"
              onClick={() => { setEditing(null); setForm(defaultForm); setModalOpen(true); }}
            >
              Lisa blogi
            </button>
          </div>
          {/* Blog Table */}
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Pealkiri</th>
                  <th className="px-4 py-2 text-left">Kategooria</th>
                  <th className="px-4 py-2 text-left">Autor</th>
                  <th className="px-4 py-2 text-left">Avaldatud</th>
                  <th className="px-4 py-2 text-left">Toimingud</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.map(blog => (
                  <tr key={blog.id} className="border-b items-center text-center">
                    <td className="px-4 py-2">{blog.title}</td>
                    <td className="px-4 py-2">{blog.category}</td>
                    <td className="px-4 py-2">{blog.author}</td>
                    <td className="px-4 py-2">{blog.published}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => handleEdit(blog)}>Muuda</button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDelete(blog.id)}>Kustuta</button>
                    </td>
                  </tr>
                ))}
                {filteredBlogs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-400">Blogisid ei leitud.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Modal for Create/Update */}
          {modalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded shadow-lg w-full max-w-5xl relative max-h-[90%] overflow-y-scroll">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl"
                  onClick={() => setModalOpen(false)}
                >
                  &times;
                </button>
                <h2 className="text-xl font-semibold mb-4">{editing ? "Muuda blogi" : "Lisa blogi"}</h2>
                {error && <div className="text-red-600 mb-2">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input name="category" value={form.category} onChange={handleChange} placeholder="Kategooria" className="border rounded px-3 py-2" />
                    <input name="title" value={form.title} onChange={handleChange} placeholder="Pealkiri" className="border rounded px-3 py-2" />
                    <div>
                      <input name="title_image" type="file" accept="image/*" onChange={e => setFormFiles(f => ({ ...f, title_image: e.target.files?.[0] || null }))} className="border rounded px-3 py-2 w-full" />
                      {editing && form.title_image && !formFiles.title_image && (
                        <img src={form.title_image} alt="title" className="mt-2 h-16 object-contain" />
                      )}
                    </div>
                    <input name="author" value={form.author} onChange={handleChange} placeholder="Autor" className="border rounded px-3 py-2" />
                    <input name="published" value={form.published} onChange={handleChange} placeholder="Avaldatud (YYYY-MM-DD HH:MM:SS)" className="border rounded px-3 py-2" />
                    <div>
                      <input name="intro_image" type="file" accept="image/*" onChange={e => setFormFiles(f => ({ ...f, intro_image: e.target.files?.[0] || null }))} className="border rounded px-3 py-2 w-full" />
                      {editing && form.intro_image && !formFiles.intro_image && (
                        <img src={form.intro_image} alt="intro" className="mt-2 h-16 object-contain" />
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold">Sissejuhatus</label>
                    <ReactQuill theme="snow" value={form.introduction} onChange={value => handleQuillChange("introduction", value)} />
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold">Sissejuhatuse detailid</label>
                    <ReactQuill theme="snow" value={form.intro_detail} onChange={value => handleQuillChange("intro_detail", value)} />
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold">Kokkuvõte</label>
                    <ReactQuill theme="snow" value={form.summary} onChange={value => handleQuillChange("summary", value)} />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="bg-brand-primary text-white px-4 py-2 rounded font-semibold" disabled={loading}>
                      {editing ? "Salvesta muudatused" : "Lisa blogi"}
                    </button>
                    <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => setModalOpen(false)}>
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
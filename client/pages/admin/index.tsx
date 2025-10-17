import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { t , currentLanguage } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        if (parsed.admin) {
          navigate(`/${currentLanguage}/admin/blog`);
        }
      } catch {}
    }
  }, [navigate, currentLanguage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Sisselogimine ebaõnnestus.");
      } else if (!data.user.admin) {
        setError("Teil puudub administraatori õigus.");
      } else {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        navigate(`/${currentLanguage}/admin/blog`);
      }
    } catch {
      setError("Võrgu viga. Palun proovige hiljem uuesti.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 w-full">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">{t('navigation.login')}</h1>
        {error && <div className="text-red-600 text-center mb-4">{error}</div>}
        <div className="mb-4">
          <label className="block mb-2 font-medium">{t('formLabels.email')}</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 font-medium">{t('auth.password')}</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-brand-primary text-white py-2 rounded font-semibold hover:bg-opacity-90 transition"
          disabled={loading}
        >
          {loading ? t('common.loading') : t('navigation.login')}
        </button>
      </form>
    </div>
  );
} 
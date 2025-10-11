import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, googleLogin } = useAuth();
  const { t , currentLanguage } = useI18n();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // const res = await fetch("/api/auth/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, password }),
      // });
      // const data = await res.json();
      // if (!res.ok) {
      //   setError(data.message || "Sisselogimine ebaõnnestus.");
      // } else {
      //   localStorage.setItem("user", JSON.stringify(data.user));
      //   localStorage.setItem("token", data.token);
      //   navigate("/");
      // }
      await login(email, password);
      navigate(`/${currentLanguage}`);
    } catch (err) {
      console.error(err);
      setError(t('auth.networkErrorTryLater'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const { access_token } = tokenResponse;

      const userInfo = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const profile = await userInfo.json();

      await googleLogin(profile.given_name + " " + profile.family_name, profile.email);

      navigate(`/${currentLanguage}`);
    },
    onError: () => console.error("Login Failed"),
    flow: "implicit"
  })

  return (
    <form className="w-full max-w-[540px]" onSubmit={handleSubmit}>
      {/* Title */}
      <h1 className="text-brand-text font-poppins text-[30px] font-semibold leading-[150%] tracking-[-0.9px] mb-[60px]">
        {t('auth.welcomeBack')}
      </h1>

      {/* Email Field */}
      <div className="mb-[20px]">
        <label className="block text-black font-poppins text-lg font-medium mb-[10px]">
          {t('auth.emailAddress')}
        </label>
        <input
          type="email"
          placeholder={t('auth.emailPlaceholder')}
          className="w-full h-[57px] px-5 rounded-[10px] border border-brand-gray-border bg-white font-poppins text-base placeholder:text-brand-gray focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>

      {/* Password Field */}
      <div className="mb-[53px]">
        <label className="block text-black font-poppins text-lg font-medium mb-[10px]">
          {t('auth.password')}
        </label>
        <input
          type="password"
          placeholder={t('auth.passwordPlaceholder')}
          className="w-full h-[57px] px-5 rounded-[10px] border border-brand-gray-border bg-white font-poppins text-base placeholder:text-brand-gray focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </div>

      {/* Error Message */}
      {error && <div className="text-red-600 text-base text-center mb-4">{error}</div>}

      {/* Forgot Password Link */}
      <a
        href="#"
        onClick={() => navigate(`/${currentLanguage}/password-reset`)}
        className="block text-black font-poppins text-lg font-normal underline mb-[57px] hover:text-brand-primary transition-colors"
      >
        {t('auth.forgotPassword')}
      </a>

      {/* Login Button */}
      <button
        type="submit"
        className="w-full h-[54px] flex justify-center items-center gap-[10px] rounded-[10px] bg-brand-primary text-white font-poppins text-base font-normal leading-[150%] mb-[36px] hover:bg-opacity-90 transition-all"
        disabled={loading}
      >
        {loading ? t('auth.loggingIn') : t('auth.login')}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-[20px] mb-[30px]">
        <div className="flex-1 h-px bg-brand-gray-light"></div>
        <span className="text-black font-poppins text-lg font-normal">{t('common.or')}</span>
        <div className="flex-1 h-px bg-brand-gray-light"></div>
      </div>

      {/* Social Login Buttons */}
      <div className="space-y-[15px]">
        {/* Apple Login */}
        <button type="button" className="w-full h-[57px] flex justify-center items-center gap-2 rounded-[10px] border-2 border-brand-gray-border hover:bg-gray-50 transition-colors">
          <img
            className="w-6 h-6 object-contain align-middle"
            alt="Apple logo"
            src="/img/apple.svg"
          />
          <span className="text-[#3F3F46] text-center font-poppins text-lg font-normal leading-5">
            {t('auth.loginWithApple')}
          </span>
        </button>

        {/* Google Login */}
        <button
          type="button"
          onClick={() => handleGoogleLogin()}
          className="w-full h-[57px] flex justify-center items-center gap-2 rounded-[10px] border-2 border-brand-gray-border hover:bg-gray-50 transition-colors">
          <img className="w-6 h-6" alt="Google logo" src="/img/google.svg" />
          <span className="text-[#3F3F46] text-center font-poppins text-lg font-normal leading-5">
            {t('auth.loginWithGoogle')}
          </span>
        </button>
      </div>
    </form>
  );
}

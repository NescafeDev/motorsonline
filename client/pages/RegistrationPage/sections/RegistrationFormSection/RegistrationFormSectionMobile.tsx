import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Checkbox } from "../../../../components/ui/checkbox";
import { Input } from "../../../../components/ui/input";
import { Separator } from "../../../../components/ui/separator";
import { useGoogleLogin } from "@react-oauth/google";
import { useI18n } from "@/contexts/I18nContext";

export const RegistrationFormSectionMobile = (): JSX.Element => {
  const navigate = useNavigate();
  const { t , currentLanguage } = useI18n();
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "private", // Default to private
    terms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRadioChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      userType: value,
    }));
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

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.given_name + " " + profile.family_name,
          email: profile.email
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || t('auth.loginFailed'));
      } else {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        navigate(`/${currentLanguage}`);
      }
    },
    onError: () => console.error("Login Failed"),
    flow: "implicit"
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.fullname || !form.email || !form.password || !form.confirmPassword) {
      setError(t('auth.allFieldsRequired'));
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Paroolid ei kattu.");
      return;
    }
    if (!form.terms) {
      setError(t('auth.mustAgreeToTerms'));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.fullname,
          email: form.email,
          password: form.password,
          userType: form.userType,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || t('auth.registrationFailed'));
      } else {
        navigate(`/${currentLanguage}/login`);
      }
    } catch (err) {
      setError(t('auth.networkErrorTryLater'));
    } finally {
      setLoading(false);
    }
  };

  // Form field data
  const formFields = [
    {
      id: "fullname",
      label: t('formLabels.fullName'),
      placeholder: t('formLabels.enterFullName'),
    },
    {
      id: "email",
      label: t('auth.email'),
      placeholder: t('auth.email'),
    },
    {
      id: "password",
      label: t('auth.password'),
      placeholder: t('auth.password'),
      type: "password",
    },
    {
      id: "confirmPassword",
      label: t('auth.confirmPassword'),
      placeholder: t('auth.password'),
      type: "password",
    },
  ];

  return (
    <div className="w-full">
      {/* Mobile Hero Section */}
      <div className="w-full h-[200px] bg-[url(/img/register.png)] bg-cover bg-center relative mb-6">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 flex items-center justify-center h-full p-4">
          <h2 className="text-white text-center font-poppins text-xl font-semibold leading-normal">
            {t('auth.chooseIdealCar')}
          </h2>
        </div>
      </div>

      {/* Mobile Form Section */}
      <Card className="w-full rounded-[10px] overflow-hidden bg-[#f6f7f9] border-none p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <h1 className="font-semibold text-2xl text-secondary-500 tracking-[-0.90px] [font-family:'Poppins',Helvetica] text-center">
              {t('auth.createAccount')}
            </h1>
            {/* User Type Radio Buttons */}
            <div className="space-y-5">
              <label className="block font-medium text-base text-black [font-family:'Poppins',Helvetica]">
                {t('auth.selectUserType')}
              </label>
              
            <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="private"
                    name="userType"
                    value="private"
                    checked={form.userType === "private"}
                    onChange={(e) => handleRadioChange(e.target.value)}
                    className="w-4 h-4 text-[#06d6a0] focus:ring-[#06d6a0]"
                  />
                  <label
                    htmlFor="private"
                    className="text-base [font-family:'Poppins',Helvetica] cursor-pointer"
                  >
                    {t('auth.privateUser')}
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="company"
                    name="userType"
                    value="company"
                    checked={form.userType === "company"}
                    onChange={(e) => handleRadioChange(e.target.value)}
                    className="w-4 h-4 text-[#06d6a0] focus:ring-[#06d6a0]"
                  />
                  <label
                    htmlFor="company"
                    className="text-base [font-family:'Poppins',Helvetica] cursor-pointer"
                  >
                    {t('auth.companyUser')}
                  </label>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {formFields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <label
                    htmlFor={field.id}
                    className="block font-medium text-base text-black [font-family:'Poppins',Helvetica]"
                  >
                    {field.label}
                  </label>
                  <Input
                    id={field.id}
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                    className="h-[50px] bg-white rounded-[10px] border border-solid border-[#545454] px-4 [font-family:'Poppins',Helvetica] text-base placeholder:text-[#bfbfbf]"
                    value={form[field.id as keyof typeof form] as string}
                    onChange={handleChange}
                    autoComplete={field.id}
                  />
                </div>
              ))}
            </div>

            

            <div className="flex items-start space-x-3 pt-4">
              <Checkbox
                id="terms"
                className="w-5 h-5 rounded bg-white data-[state=checked]:bg-[#06d6a0] border-[#06d6a0] mt-1 flex-shrink-0"
                checked={form.terms}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, terms: !!checked }))}
              />
              <label
                htmlFor="terms"
                className="text-sm [font-family:'Poppins',Helvetica] leading-5 text-black"
              >
                {t('auth.agreeToTerms')}
              </label>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <Button 
              className="w-full h-[50px] bg-[#06d6a0] hover:bg-[#05c090] rounded-[10px] [font-family:'Poppins',Helvetica] text-base font-normal"
              type="submit"
              disabled={loading}
            >
              {loading ? t('auth.registering') : t('auth.register')}
            </Button>

          <div className="flex items-center justify-center space-x-3 pt-4">
            <Separator className="w-16" />
            <span className="[font-family:'Poppins',Helvetica] font-normal text-sm text-black">
              {t('auth.or')}
            </span>
            <Separator className="w-16" />
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full h-[50px] flex items-center justify-center gap-3 rounded-[10px] border-2 border-solid border-[#545454] [font-family:'Poppins',Helvetica] font-normal text-base text-zinc-700"
            >
              <img
                className="w-5 h-5 object-cover"
                alt="Apple logo"
                src="/img/apple.svg"
              />
              {t('auth.registerWithApple')}
            </Button>

            <Button
              onClick={() => handleGoogleLogin()}
              variant="outline"
              className="w-full h-[50px] flex items-center justify-center gap-3 rounded-[10px] border-2 border-solid border-[#545454] [font-family:'Poppins',Helvetica] font-normal text-base text-zinc-700"
            >
              <img className="w-5 h-5" alt="Google logo" src="/img/google.png" />
              {t('auth.registerWithGoogle')}
            </Button>
          </div>

          {/* Login Link */}
          <div className="text-center pt-4">
            <p className="text-sm [font-family:'Poppins',Helvetica] text-black">
              {t('auth.alreadyHaveAccount')}
              <a href="/login" className="text-[#06d6a0] font-medium hover:underline">
                {t('auth.login')}
              </a>
            </p>
          </div>
          </div>
        </form>
      </Card>
    </div>
  );
}; 
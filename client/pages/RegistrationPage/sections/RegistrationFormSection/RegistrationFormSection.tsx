import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Checkbox } from "../../../../components/ui/checkbox";
import { Input } from "../../../../components/ui/input";
import { Separator } from "../../../../components/ui/separator";
import { useGoogleLogin } from "@react-oauth/google";
import { useI18n } from "@/contexts/I18nContext";

export const RegistrationFormSection = (): JSX.Element => {
  const navigate = useNavigate();
  const { t } = useI18n();
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
        navigate("/");
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
        navigate("/login");
      }
    } catch (err) {
      setError(t('auth.networkErrorTryLater'));
    } finally {
      setLoading(false);
    }
  };

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
    <Card className="flex w-full rounded-[10px] overflow-hidden bg-[#f6f7f9] border-none">
      <div className="flex flex-col p-10 w-1/2 space-y-6">
        <form onSubmit={handleSubmit}>
          <h1 className="font-semibold text-3xl text-secondary-500 tracking-[-0.90px] [font-family:'Poppins',Helvetica] mb-5">
            Loo oma kasutajakonto!
          </h1>

          {/* User Type Radio Buttons */}
          <div className="space-y-4">
            <label className="block font-medium text-lg text-black [font-family:'Poppins',Helvetica]">
              Vali kasutaja
            </label>
            <div className="flex space-x-10">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="private"
                  name="userType"
                  value="private"
                  checked={form.userType === "private"}
                  onChange={(e) => handleRadioChange(e.target.value)}
                  className="w-5 h-5 text-[#06d6a0] focus:ring-[#06d6a0]"
                />
                <label
                  htmlFor="private"
                  className="text-lg [font-family:'Poppins',Helvetica] cursor-pointer"
                >
                  Eraisik
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
                  className="w-5 h-5 text-[#06d6a0] focus:ring-[#06d6a0]"
                />
                <label
                  htmlFor="company"
                  className="text-lg [font-family:'Poppins',Helvetica] cursor-pointer"
                >
                  Ettevõte
                </label>
              </div>
            </div>
          </div>
          <div className="space-y-6 mt-6">
            {formFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <label
                  htmlFor={field.id}
                  className="block font-medium text-lg text-black [font-family:'Poppins',Helvetica]"
                >
                  {field.label}
                </label>
                <Input
                  id={field.id}
                  type={field.type || "text"}
                  placeholder={field.placeholder}
                  className="h-[57px] bg-white rounded-[10px] border border-solid border-[#545454] px-5 [font-family:'Poppins',Helvetica] text-base placeholder:text-[#bfbfbf]"
                  value={form[field.id as keyof typeof form] as string}
                  onChange={handleChange}
                  autoComplete={field.id}
                />
              </div>
            ))}
          </div>



          <div className="flex items-start space-x-4 pt-4 mb-5">
            <Checkbox
              id="terms"
              className="w-6 h-6 rounded bg-white data-[state=checked]:bg-[#06d6a0] border-[#06d6a0] mt-1"
              checked={form.terms}
              onCheckedChange={(checked) => setForm((prev) => ({ ...prev, terms: !!checked }))}
            />
            <label
              htmlFor="terms"
              className="text-lg [font-family:'Poppins',Helvetica] leading-6"
            >
              Olen lugenud ja nõustun kasutustingimuste ja privaatsuspoliitikaga.
            </label>
          </div>

          {error && (
            <div className="text-red-600 text-base text-center">{error}</div>
          )}

          <Button
            className="w-full h-[57px] bg-[#06d6a0] hover:bg-[#05c090] rounded-[10px] [font-family:'Poppins',Helvetica] text-base font-normal"
            type="submit"
            disabled={loading}
          >
            {loading ? "Registreerin..." : "Registreeru"}
          </Button>

          <div className="flex items-center justify-center space-x-4 pt-4">
            <Separator className="w-[237px]" />
            <span className="[font-family:'Poppins',Helvetica] font-normal text-lg">
              või
            </span>
            <Separator className="w-[236px]" />
          </div>
        </form>
        <Button
          variant="outline"
          className="w-full h-[57px] flex items-center justify-center gap-2 rounded-[10px] border-2 border-solid border-[#545454] [font-family:'Poppins',Helvetica] font-normal text-lg text-zinc-700"
        >
          <img
            className="w-6 h-6 object-contain align-middle"
            alt="Apple logo"
            src="/img/apple.svg"
          />
          Registreeru Apple&apos;i kaudu
        </Button>

        <Button
          onClick={() => handleGoogleLogin()}
          variant="outline"
          className="w-full h-[57px] flex items-center justify-center gap-2 rounded-[10px] border-2 border-solid border-[#545454] [font-family:'Poppins',Helvetica] font-normal text-lg text-zinc-700"
        >
          <img className="w-6 h-6" alt="Google logo" src="/img/google.svg" />
          Registreeru Google&apos;i kaudu
        </Button>
      </div>

      <div className="w-1/2 bg-[url(/img/register.png)] bg-cover bg-center flex items-center justify-center">
        <h2 className="text-[46px] text-white font-semibold text-center [font-family:'Poppins',Helvetica] max-w-[538px]">
          Vali oma ideaalne auto koos meiega
        </h2>
      </div>
    </Card>
  );
};

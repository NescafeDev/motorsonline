import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Checkbox } from "../../../../components/ui/checkbox";
import { Input } from "../../../../components/ui/input";
import { Separator } from "../../../../components/ui/separator";
import { useGoogleLogin } from "@react-oauth/google";

export const RegistrationFormSectionMobile = (): JSX.Element => {
  const navigate = useNavigate();
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
        setError(data.message || "Sisselogimine ebaõnnestus.");
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
      setError("Kõik väljad on kohustuslikud.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Paroolid ei kattu.");
      return;
    }
    if (!form.terms) {
      setError("Peate nõustuma tingimustega.");
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
        setError(data.message || "Registreerimine ebaõnnestus.");
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError("Võrgu viga. Palun proovige hiljem uuesti.");
    } finally {
      setLoading(false);
    }
  };

  // Form field data
  const formFields = [
    {
      id: "fullname",
      label: "Täisnimi",
      placeholder: "Sisesta täisnimi",
    },
    {
      id: "email",
      label: "E-posti aadress",
      placeholder: "Sisesta e-post",
    },
    {
      id: "password",
      label: "Parool",
      placeholder: "Sisesta parool",
      type: "password",
    },
    {
      id: "confirmPassword",
      label: "Korda parooli",
      placeholder: "Sisesta parool",
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
            Vali oma ideaalne auto koos meiega
          </h2>
        </div>
      </div>

      {/* Mobile Form Section */}
      <Card className="w-full rounded-[10px] overflow-hidden bg-[#f6f7f9] border-none p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <h1 className="font-semibold text-2xl text-secondary-500 tracking-[-0.90px] [font-family:'Poppins',Helvetica] text-center">
              Loo oma kasutajakonto!
            </h1>
            {/* User Type Radio Buttons */}
            <div className="space-y-5">
              <label className="block font-medium text-base text-black [font-family:'Poppins',Helvetica]">
                Vali kasutaja
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
                    className="w-4 h-4 text-[#06d6a0] focus:ring-[#06d6a0]"
                  />
                  <label
                    htmlFor="company"
                    className="text-base [font-family:'Poppins',Helvetica] cursor-pointer"
                  >
                    Ettevõte
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
                className="w-5 h-5 rounded bg-[#06d6a0] data-[state=checked]:bg-[#06d6a0] border-none mt-1 flex-shrink-0"
                checked={form.terms}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, terms: !!checked }))}
              />
              <label
                htmlFor="terms"
                className="text-sm [font-family:'Poppins',Helvetica] leading-5 text-black"
              >
                Olen lugenud ja nõustun kasutustingimuste ja privaatsuspoliitikaga.
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
              {loading ? "Registreerin..." : "Registreeru"}
            </Button>

          <div className="flex items-center justify-center space-x-3 pt-4">
            <Separator className="w-16" />
            <span className="[font-family:'Poppins',Helvetica] font-normal text-sm text-black">
              või
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
              Registreeru Apple&apos;i kaudu
            </Button>

            <Button
              onClick={() => handleGoogleLogin()}
              variant="outline"
              className="w-full h-[50px] flex items-center justify-center gap-3 rounded-[10px] border-2 border-solid border-[#545454] [font-family:'Poppins',Helvetica] font-normal text-base text-zinc-700"
            >
              <img className="w-5 h-5" alt="Google logo" src="/img/google.png" />
              Registreeru Google&apos;i kaudu
            </Button>
          </div>

          {/* Login Link */}
          <div className="text-center pt-4">
            <p className="text-sm [font-family:'Poppins',Helvetica] text-black">
              Sul on juba konto?{" "}
              <a href="/login" className="text-[#06d6a0] font-medium hover:underline">
                Logi sisse
              </a>
            </p>
          </div>
          </div>
        </form>
      </Card>
    </div>
  );
}; 
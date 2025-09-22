import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Checkbox } from "../../../../components/ui/checkbox";
import { Input } from "../../../../components/ui/input";
import { Separator } from "../../../../components/ui/separator";

export const RegistrationFormSectionMobile = (): JSX.Element => {
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
        <div className="space-y-6">
          <h1 className="font-semibold text-2xl text-secondary-500 tracking-[-0.90px] [font-family:'Poppins',Helvetica] text-center">
            Loo oma kasutajakonto!
          </h1>

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
                />
              </div>
            ))}
          </div>

          <div className="flex items-start space-x-3 pt-4">
            <Checkbox
              id="terms"
              className="w-5 h-5 rounded bg-[#06d6a0] data-[state=checked]:bg-[#06d6a0] border-none mt-1 flex-shrink-0"
            />
            <label
              htmlFor="terms"
              className="text-sm [font-family:'Poppins',Helvetica] leading-5 text-black"
            >
              Olen lugenud ja nõustun kasutustingimuste ja privaatsuspoliitikaga.
            </label>
          </div>

          <Button className="w-full h-[50px] bg-[#06d6a0] hover:bg-[#05c090] rounded-[10px] [font-family:'Poppins',Helvetica] text-base font-normal">
            Registreeru
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
      </Card>
    </div>
  );
}; 
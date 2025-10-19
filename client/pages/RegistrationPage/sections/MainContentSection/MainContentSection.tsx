import React from "react";
import { Button } from "../../../../components/ui/button";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "../../../../components/ui/toggle-group";
import { useI18n } from "@/contexts/I18nContext";

export const MainContentSection = (): JSX.Element => {
  const { t } = useI18n();
  // Navigation menu items
  const menuItems = [
    { id: 1, text: "Lorem ipsum" },
    { id: 2, text: "Lorem ipsum" },
    { id: 3, text: "Lorem ipsum" },
  ];

  // Language options
  const languages = [
    { code: "EE", label: "EE", active: true },
    { code: "EN", label: "EN", active: false },
  ];

  return (
    <header className="flex items-center justify-between w-full py-3 px-6">
      {/* Logo */}
      <div className="relative w-[192px] h-[21px] bg-[url(/group-1.png)] bg-[100%_100%]" />

      <div className="flex items-center gap-[30px]">
        {/* Navigation Menu */}
        <nav className="flex items-center gap-[30px]">
          {menuItems.map((item) => (
            <a
              key={item.id}
              href="#"
              className="font-['Poppins',Helvetica] font-normal text-lg text-center tracking-[0] leading-[25.2px] text-black"
            >
              {item.text}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-[30px]">
          {/* Language Selector */}
          <div className="flex items-center gap-5">
            <ToggleGroup type="single" defaultValue="EE">
              {languages.map((lang) => (
                <React.Fragment key={lang.code}>
                  {lang.active ? (
                    <ToggleGroupItem
                      value={lang.code}
                      className="h-[45px] px-4 py-2.5 rounded-[10px] border border-solid border-[#06d6a0] text-[#06d6a0] font-['Poppins',Helvetica] font-normal text-lg"
                    >
                      {lang.label}
                    </ToggleGroupItem>
                  ) : (
                    <span className="font-['Poppins',Helvetica] font-normal text-black text-lg text-center tracking-[0] leading-6">
                      {lang.label}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </ToggleGroup>
          </div>

          {/* Authentication Buttons */}
          <div className="flex items-center gap-5">
            <Button
              variant="outline"
              className="h-[45px] px-5 py-3 rounded-[10px] border border-solid border-[#06d6a0] text-[#06d6a0] font-['Poppins',Helvetica] font-normal text-base"
            >
              {t('navigation.login')}
            </Button>
            <Button className="h-[45px] px-5 py-3 rounded-[10px] bg-[#06d6a0] text-white font-['Poppins',Helvetica] font-normal text-base">
              {t('navigation.register')}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

import React from "react";
import { Separator } from "../../../../components/ui/separator";

export const RecentListingsSection = (): JSX.Element => {
  // Navigation links data
  const navLinks = [
    { id: 1, text: "Lorem ipsum" },
    { id: 2, text: "Lorem ipsum" },
    { id: 3, text: "Lorem ipsum" },
  ];

  // Footer links data
  const footerLinks = [
    { id: 1, text: "Privacy & Policy" },
    { id: 2, text: "Terms & Condition" },
  ];

  return (
    <footer className="w-full h-80 bg-[#1d1d1d]">
      <div className="relative w-full h-full max-w-[1440px] mx-auto px-[100px]">
        {/* Logo and navigation section */}
        <div className="flex justify-between items-center pt-[100px]">
          <div className="w-[251px] h-[27px] bg-[url(/----1.png)] bg-[100%_100%]" />

          <div className="flex gap-[78px]">
            {navLinks.map((link) => (
              <div
                key={link.id}
                className="font-normal text-[#b0b0b0] text-center text-lg tracking-[0] leading-[25.2px] whitespace-nowrap font-['Poppins',Helvetica]"
              >
                {link.text}
              </div>
            ))}
          </div>
        </div>

        {/* Separator line */}
        <Separator className="mt-[49px] bg-transparent">
          <img
            className="w-full h-px object-cover"
            alt="Line"
            src="/line-223.svg"
          />
        </Separator>

        {/* Footer bottom section */}
        <div className="flex justify-between items-center mt-[46px]">
          <div className="font-['Poppins',Helvetica] font-normal text-[#6c6c6c] text-base tracking-[0] leading-[22.4px] whitespace-nowrap">
            © 2025 Motorsonline All rights reserved.
          </div>

          <div className="flex gap-[40px]">
            {footerLinks.map((link) => (
              <div
                key={link.id}
                className="font-['Poppins',Helvetica] font-normal text-[#6c6c6c] text-base text-right tracking-[-0.32px] leading-6 whitespace-nowrap cursor-pointer"
              >
                {link.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

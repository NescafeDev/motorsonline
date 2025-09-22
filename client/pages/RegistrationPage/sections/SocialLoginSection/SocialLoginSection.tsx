import React from "react";
import { Separator } from "../../../../components/ui/separator";

export const SocialLoginSection = (): JSX.Element => {
  // Navigation links data
  const navLinks = [
    { text: "Lorem ipsum" },
    { text: "Lorem ipsum" },
    { text: "Lorem ipsum" },
  ];

  // Footer links data
  const footerLinks = [
    { text: "Privacy & Policy" },
    { text: "Terms & Condition" },
  ];

  return (
    <footer className="w-full bg-[#1d1d1d] py-16">
      <div className="container mx-auto px-6 max-w-[1240px]">
        {/* Top section with logo and navigation */}
        <div className="flex flex-row justify-between items-center mb-12">
          {/* Logo */}
          <div className="w-[251px] h-[27px] bg-[url(/----1.png)] bg-[100%_100%]" />

          {/* Navigation links */}
          <div className="flex space-x-10">
            {navLinks.map((link, index) => (
              <div
                key={index}
                className="font-['Poppins',Helvetica] font-normal text-[#b0b0b0] text-lg text-center tracking-[0] leading-[25.2px] whitespace-nowrap"
              >
                {link.text}
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <Separator className="bg-white/10 my-10" />

        {/* Bottom section with copyright and links */}
        <div className="flex flex-row justify-between items-center">
          {/* Copyright */}
          <div className="font-['Poppins',Helvetica] font-normal text-[#6c6c6c] text-base tracking-[0] leading-[22.4px] whitespace-nowrap">
            © 2025 Motorsonline All rights reserved.
          </div>

          {/* Footer links */}
          <div className="flex space-x-6">
            {footerLinks.map((link, index) => (
              <div
                key={index}
                className="font-['Poppins',Helvetica] font-normal text-[#6c6c6c] text-base text-right tracking-[-0.32px] leading-6 whitespace-nowrap cursor-pointer hover:text-[#8c8c8c] transition-colors"
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

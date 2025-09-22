import React from "react";
import { RegistrationFormSectionMobile } from "./sections/RegistrationFormSection/RegistrationFormSectionMobile";
import Header from "@/components/mobile/Header";
import Footer from "@/components/mobile/Footer";

export default function RegistrationPageMobile() {
  return (
    <main className="bg-white flex flex-col w-full">
      <Header />
      <div className="bg-white w-full relative">
        {/* Registration form section - mobile optimized */}
        <section className="w-full mx-auto px-4 mb-8">
          <RegistrationFormSectionMobile />
        </section>
      </div>
      <Footer />
    </main>
  );
} 
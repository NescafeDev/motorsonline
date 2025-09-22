import React from "react";
import Header from "./Header";
import Footer from "./Footer";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col w-full">
      {/* Header with consistent container */}
      <div className="w-full bg-white">
        <div className="max-w-[1440px] mx-auto">
          <Header />
        </div>
      </div>

      {/* Main content area */}
      <main className={`flex-1 ${className}`}>
        {children}
      </main>

      {/* Footer with consistent container */}
      <div className="w-full bg-brand-dark">
        <div className="max-w-[1440px] mx-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
} 
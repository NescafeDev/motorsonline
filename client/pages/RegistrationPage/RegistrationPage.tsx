import React from "react";
import { Card, CardContent } from "../../components/ui/card";
import { RegistrationFormSection } from "./sections/RegistrationFormSection";
import PageContainer from "../../components/PageContainer";

export default function RegistrationPage() {
  return (
    <PageContainer>
      <div className="bg-white w-full flex flex-col items-center justify-center">
        {/* Main content section at the top */}

        {/* Registration form section in the middle */}
        <section className="w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-[100px] mb-10">
          <Card className="w-full rounded-[10px] border-0 shadow-none">
            <CardContent className="p-0 relative">
              <RegistrationFormSection />
              <div className="w-5 h-5 absolute top-[593px] left-[42px] bg-[url(/group.png)] bg-[100%_100%]" />
            </CardContent>
          </Card>
        </section>
      </div>
    </PageContainer>
  );
}

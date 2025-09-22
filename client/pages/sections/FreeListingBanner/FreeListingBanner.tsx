import React from "react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { useNavigate } from "react-router-dom";

export const FreeListingBanner = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <section className="max-w-[1240px] mx-auto mt-10">
      <Card className="w-full h-[127px] bg-white rounded-[10px] flex items-center justify-between px-[67px]">
        <p className="font-normal text-secondary-500 text-xl tracking-[-0.60px] leading-[30px]">
          Kuulutuste avaldamine on tasuta. Kasutage võimalust, et leida
          oma sõidukile uus omanik!
        </p>
        <Button
          variant="outline"
          className="h-[45px] border-[#06d6a0] text-[#06d6a0] rounded-[10px]"
          onClick={() => {
            const user = localStorage.getItem("user");
            if (!user) {
              navigate('/login');
            } else {
              navigate('/adds');
            }
          }}
        >
          Lisa kuulutus tasuta
        </Button>
      </Card>
    </section>
  );
}; 
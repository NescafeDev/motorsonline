import React from "react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";

export const FreeListingBanner = (): JSX.Element => {
  const navigate = useNavigate();
  const { t , currentLanguage } = useI18n();

  return (
    <section className="max-w-[1240px] mx-auto mt-10">
      <Card className="w-full h-[127px] bg-white rounded-[10px] flex items-center justify-between px-[67px]">
        <p className="font-normal text-secondary-500 text-xl tracking-[-0.60px] leading-[30px]">
          {t('uiActions.sellBuyFree')}
        </p>
        <Button
          variant="outline"
          className="h-[45px] border-[#06d6a0] text-[#06d6a0] rounded-[10px]"
          onClick={() => {
            const user = localStorage.getItem("user");
            if (!user) {
              navigate(`/${currentLanguage}/login`);
            } else {
              navigate(`/${currentLanguage}/adds`);
            }
          }}
        >
          {t('uiActions.addListingFree')}
        </Button>
      </Card>
    </section>
  );
}; 
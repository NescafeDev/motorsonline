import React from "react";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";

export const HeroSection = (): JSX.Element => {
  const navigate = useNavigate();
  return (
    <section className="relative">
      <div className="flex justify-between">
        <div className="col-7 mx-auto my-auto w-full py-12 pl-[calc((100dvw-1440px)/2+100px)]">
          <div className="w-full mx-auto my-auto p-6 md:p-0">
            <h1 className="font-semibold text-[46px] leading-normal mb-6">
              MotorsOnline – Leia oma järgmine auto siit!
            </h1>
            <p className="font-normal text-[30px] mb-6 tracking-[-0.12px] italic">Drive your dream!</p>
            <p className="font-normal text-lg text-secondary-500 tracking-[-0.54px] leading-[27px] max-w-[528px] mb-10 text-[18px]">
              Lorem ipsum dolor sit amet consectetur. Quisque erat
              imperdiet egestas pretium. Nibh convallis id nulla non diam.
            </p>
            <Button 
              onClick={() => navigate("/register")}
              className="px-[30px] py-[15px] bg-[#06d6a0] rounded-[10px] text-white"
            >
            Registreeru
            </Button>
          </div>
        </div>
        <div className="col-5 w-full h-auto">
          <img
            className="w-[100%] h-[100%]"
            alt="Car hero image"
            src="/img/sven-d-a4S6KUuLeoM-unsplash.png"
          />
        </div>
      </div>
    </section>
  );
}; 
import React from "react";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";

export const HeroSection = (): JSX.Element => {
  const navigate = useNavigate();
  return (
    <section className="">
        <div className="w-full h-auto flex justify-center cursor-pointer" onClick={() => navigate("/blog")}>
          <img
            className="h-[100%] object-cover mt-10 rounded-xl "
            alt="Car hero image"
            src="/img/photo_2025-10-10_22-33-26.jpg"
          />
      </div>
    </section>
  );
}; 
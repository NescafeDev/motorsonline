import React from "react";
import { Button } from "../../../components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export const HeroSection = (): JSX.Element => {
  const navigate = useNavigate();
  // const { id } = useParams();
  // const [blog, setBlog] = useState<any>(null);
  // useEffect(() => {
  //   if (!id) return;
  //   fetch(`/api/blogs/${id}`)
  //     .then(res => res.json())
  //     .then(setBlog);
  // }, [id]);
  return (
    <section className="">
        <div className="w-full h-auto flex justify-center">
          <img
            className="h-[100%] object-cover mt-10 rounded-xl "
            alt="Car hero image"
            src="/img/photo_2025-10-10_22-33-26.jpg"
          />
      </div>
    </section>
  );
}; 
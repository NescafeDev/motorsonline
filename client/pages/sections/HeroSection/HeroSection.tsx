import React, { useEffect, useState } from "react";
import axios from "axios";

interface BannerImage {
  id: number;
  desktop_image: string;
  mobile_image: string;
  active: string;
  created_at: string;
  updated_at: string;
}

export const HeroSection = (): JSX.Element => {
  const [banners, setBanners] = useState<BannerImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get("/api/banner-images");
        
        // Filter only active banners (active === 1 or active === "1")
        const activeBanners = response.data.filter((banner: BannerImage) => banner.active === "1");
        setBanners(activeBanners);
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
    
    // Poll for updates every 5 seconds to catch changes from admin panel
    const interval = setInterval(fetchBanners, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate banners every 5 seconds
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  if (loading) {
    return (
      <section className="">
        <div className="w-full h-[400px] flex justify-center items-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </section>
    );
  }

  // if (banners.length === 0) {
  //   // Fallback to default image if no banners
  //   console.log("No banners found, showing fallback image");
  //   return (
  //     <section className="">
  //       <div className="w-full h-auto flex justify-center">
  //         <img
  //           className="h-[100%] object-cover mt-10 rounded-xl"
  //           alt="Car hero image"
  //           src="/img/photo_2025-10-10_22-33-26.jpg"
  //         />
  //       </div>
  //     </section>
  //   );
  // }

  return (
    <section className="max-w-[1240px] mx-auto">
      <div className="w-full h-full flex justify-center relative">
        {/* Banner Image - Desktop Only */}
        {banners[currentIndex] && banners[currentIndex].desktop_image && (
          <img
            className="mt-10 rounded-xl w-full h-full aspect-[1240/549] object-cover"
            alt={`Banner ${currentIndex + 1}`}
            src={banners[currentIndex].desktop_image}
            onLoad={() => console.log("Banner image loaded:", banners[currentIndex].desktop_image)}
            onError={() => console.log("Banner image failed to load:", banners[currentIndex].desktop_image)}
          />
        )}
        {banners[currentIndex] && !banners[currentIndex].desktop_image && (
          <div className="h-[200px] w-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">No desktop image available</p>
          </div>
        )}

        {/* Navigation Arrows - Only show if more than 1 banner */}
        {/* {banners.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              aria-label="Previous banner"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              aria-label="Next banner"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </>
        )} */}

        {/* Dots Indicator - Only show if more than 1 banner */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex
                    ? "bg-black"
                    : "bg-black/50 hover:bg-black/75"
                }`}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}; 
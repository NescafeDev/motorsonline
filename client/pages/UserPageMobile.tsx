import { Heart, Eye, Menu } from "lucide-react";
import Header from "@/components/mobile/Header";
import Footer from "@/components/mobile/Footer";

export default function UserPageMobile() {
  const carListings = [
    {
      id: 1,
      title: "Toyota RAV4",
      category: "Kasutatud autod » Toyota RAV4 » 2023-2025",
      description:
        "Lorem ipsum dolor sit amet consectetur. Felis fringilla pharetra sit orci sem eu suspendisse elit nibh. A morbi purus sollicitudin in nunc eget senectus. In sit gravida pellentesque ut in enim odio.",
      price: 45890,
      originalPrice: 46500,
      discount: -15,
      expiryDate: "Kuni 25. juunini 2025",
      views: 126,
      likes: 4,
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/f79839f8acc0eefdf36397b6acdaeb58ee304aaa?width=782",
    },
    {
      id: 2,
      title: "Volkswagen Touareg",
      category: "Kasutatud autod » Volkswagen Touareg » 2023-2025",
      description:
        "Lorem ipsum dolor sit amet consectetur. Felis fringilla pharetra sit orci sem eu suspendisse elit nibh. A morbi purus sollicitudin in nunc eget senectus. In sit gravida pellentesque ut in enim odio.",
      price: 15900,
      expiryDate: "Kuni 23. juunini 2025",
      views: 72,
      likes: 8,
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/7a57091642f455cc0640aa2ca748eb54e5a2ebda?width=780",
    },
    {
      id: 3,
      title: "Toyota RAV4",
      category: "Kasutatud autod » Toyota RAV4 » 2023-2025",
      description:
        "Lorem ipsum dolor sit amet consectetur. Felis fringilla pharetra sit orci sem eu suspendisse elit nibh. A morbi purus sollicitudin in nunc eget senectus. In sit gravida pellentesque ut in enim odio.",
      price: 45890,
      originalPrice: 46500,
      discount: -15,
      expiryDate: "Kuni 25. juunini 2025",
      views: 126,
      likes: 4,
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/f79839f8acc0eefdf36397b6acdaeb58ee304aaa?width=782",
    },
    {
      id: 4,
      title: "Volkswagen Touareg",
      category: "Kasutatud autod » Volkswagen Touareg » 2023-2025",
      description:
        "Lorem ipsum dolor sit amet consectetur. Felis fringilla pharetra sit orci sem eu suspendisse elit nibh. A morbi purus sollicitudin in nunc eget senectus. In sit gravida pellentesque ut in enim odio.",
      price: 15900,
      expiryDate: "Kuni 23. juunini 2025",
      views: 72,
      likes: 8,
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/7a57091642f455cc0640aa2ca748eb54e5a2ebda?width=780",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="px-5 pb-5">
        {/* Page Title */}
        <h1 className="text-[26px] font-semibold leading-[150%] tracking-[-0.78px] text-motorsonline-dark mb-10">
          Minu kuulutused
        </h1>

        {/* Add Listing Button */}
        <button className="w-full mb-10 bg-motorsonline-primary text-white font-normal text-base leading-[150%] py-[18px] rounded-[10px] hover:bg-opacity-90 transition-colors">
          + Lisa kuulutus
        </button>

        {/* Car Listings */}
        <div className="space-y-10">
          {carListings.map((car) => (
            <div
              key={car.id}
              className="bg-motorsonline-card rounded-[10px] overflow-hidden"
            >
              {/* Car Image */}
              <div className="relative">
                <img
                  src={car.image}
                  alt={car.title}
                  className="w-full h-[287px] object-cover"
                />
              </div>

              {/* Car Details */}
              <div className="p-5">
                {/* Title */}
                <h2 className="text-[26px] font-semibold leading-[150%] tracking-[-0.78px] text-motorsonline-dark mb-3">
                  {car.title}
                </h2>

                {/* Category */}
                <p className="text-sm font-medium text-motorsonline-gray mb-6">
                  {car.category}
                </p>

                {/* Description */}
                <p className="text-base leading-[150%] tracking-[-0.48px] text-motorsonline-dark mb-6">
                  {car.description}
                </p>

                {/* Price Section */}
                <div className="mb-6">
                  {car.originalPrice && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base text-motorsonline-gray line-through">
                        € {car.originalPrice.toLocaleString()}
                      </span>
                      {car.discount && (
                        <span className="px-2 py-1 bg-red-50 border border-red-500 rounded-full text-sm text-red-500">
                          {car.discount}%
                        </span>
                      )}
                    </div>
                  )}
                  <div className="text-[26px] font-semibold text-motorsonline-dark">
                    € {car.price.toLocaleString()}
                  </div>
                  <p className="text-xs leading-[150%] tracking-[-0.36px] text-motorsonline-gray mt-1">
                    Hind sisaldab käibemaksu 22%
                  </p>
                </div>

                {/* Stats and Expiry */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm leading-[150%] tracking-[-0.42px] text-motorsonline-dark">
                    {car.expiryDate}
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Eye className="h-6 w-6 text-motorsonline-dark" />
                      <span className="text-sm leading-[150%] tracking-[-0.42px] text-motorsonline-dark">
                        {car.views}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="h-6 w-6 text-motorsonline-dark" />
                      <span className="text-sm leading-[150%] tracking-[-0.42px] text-motorsonline-dark">
                        {car.likes}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button className="w-full py-3 px-5 border border-motorsonline-primary text-motorsonline-primary text-base leading-[150%] rounded-[10px] hover:bg-motorsonline-primary hover:text-white transition-colors">
                    Redigeeri
                  </button>
                  <button className="w-full py-3 px-5 border border-motorsonline-primary text-motorsonline-primary text-base leading-[150%] rounded-[10px] hover:bg-motorsonline-primary hover:text-white transition-colors">
                    Kustuta
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Results Counter */}
        <p className="text-base leading-[150%] tracking-[-0.48px] text-motorsonline-gray mt-10">
          Kuvatakse 4 teavitust 4-st
        </p>
      </main>

      {/* Footer */}
      <Footer/>
    </div>
  );
}

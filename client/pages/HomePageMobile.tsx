import { Search } from "lucide-react";
import  Header  from "@/components/mobile/Header";
import { CarCard } from "@/components/mobile/CarCard";
import { BlogCard } from "@/components/mobile/BlogCard";
import Footer from "@/components/mobile/Footer";
import { useNavigate } from "react-router-dom";
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/mobile/ui/drawer";
import { CarListingSection } from "./sections/CarListingSection/CarListingSection";
import { useState, useRef, useEffect } from "react";

export default function HomePageMobile() {
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close filter when clicking outside
  useEffect(() => {
    if (!filterOpen) return;
    function handleClick(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [filterOpen]);

  const cars = [
    {
      id: 1,
      title: "Volkswagen Touareg",
      year: 2016,
      mileage: "303 000 km",
      price: "€ 15 900",
      fuel: "Diisel",
      transmission: "Automaat",
      image:
        "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=390&h=247&fit=crop&crop=center",
      isFavorite: true,
    },
    {
      id: 2,
      title: "Volkswagen Touareg",
      year: 2016,
      mileage: "303 000 km",
      price: "€ 15 900",
      fuel: "Diisel",
      transmission: "Automaat",
      image:
        "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=390&h=247&fit=crop&crop=center",
      isFavorite: false,
    },
    {
      id: 3,
      title: "Volkswagen Touareg",
      year: 2016,
      mileage: "303 000 km",
      price: "€ 15 900",
      fuel: "Diisel",
      transmission: "Automaat",
      image:
        "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=390&h=247&fit=crop&crop=center",
      isFavorite: true,
    },
    {
      id: 4,
      title: "Volkswagen Touareg",
      year: 2016,
      mileage: "303 000 km",
      price: "€ 15 900",
      fuel: "Diisel",
      transmission: "Automaat",
      image:
        "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=390&h=247&fit=crop&crop=center",
      isFavorite: false,
    },
    {
      id: 5,
      title: "Volkswagen Touareg",
      year: 2016,
      mileage: "303 000 km",
      price: "€ 15 900",
      fuel: "Diisel",
      transmission: "Automaat",
      image:
        "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=390&h=247&fit=crop&crop=center",
      isFavorite: true,
    },
    {
      id: 6,
      title: "Volkswagen Touareg",
      year: 2016,
      mileage: "303 000 km",
      price: "€ 15 900",
      fuel: "Diisel",
      transmission: "Automaat",
      image:
        "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=390&h=247&fit=crop&crop=center",
      isFavorite: false,
    },
  ];

  const blogPosts = [
    {
      id: 1,
      title: "Lorem Ipsum",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem varius enim in eros.",
      category: "Kategooria",
      image:
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=390&h=247&fit=crop&crop=center",
    },
    {
      id: 2,
      title: "Lorem Ipsum",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem varius enim in eros.",
      category: "Kategooria",
      image:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=390&h=247&fit=crop&crop=center",
    },
    {
      id: 3,
      title: "Lorem Ipsum",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem varius enim in eros.",
      category: "Kategooria",
      image:
        "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?w=390&h=247&fit=crop&crop=center",
    },
    {
      id: 4,
      title: "Lorem Ipsum",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem varius enim in eros.",
      category: "Kategooria",
      image:
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=390&h=247&fit=crop&crop=center",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Main Content */}
      <main className="bg-[#F6F7F9]">
        {/* Hero Section */}
        <section className="bg-motors-light px-5 py-10 lg:py-16">
          <div className="text-center mb-12 max-w-4xl mx-auto px-[20px]">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-6 leading-normal px-4">
              MotorsOnline – Leia oma järgmine auto siit!
            </h1>
            <p className="text-motors-dark leading-[150%] tracking-[-0.48px] mb-8 max-w-md mx-auto px-4">
              Lorem ipsum dolor sit amet consectetur. Quisque erat imperdiet
              egestas pretium. Nibh convallis id nulla non diam.
            </p>
            <button className="w-full max-w-md bg-brand-primary text-white py-4 rounded-[10px] font-normal text-base leading-[150%] mb-8 mx-auto">
              Lorem ipsum
            </button>
          </div>
        </section>

        {/* Car Hero Image */}
        <section className="px-0">
          <div className="w-full h-[374px] bg-gray-200 overflow-hidden">
            <img
              src="/img/mobile/hero.png"
              alt="Hero Car"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-white px-5 py-8">
          <div className="bg-white p-4 rounded-lg mb-6 max-w-md mx-auto">
            <p className="text-motors-dark leading-[150%] tracking-[-0.48px] mb-6">
              Kuulutuste avaldamine on tasuta. Kasutage võimalust, et leida oma
              sõidukile uus omanik!
            </p>
            <button className="w-full border text-motors-green py-4 px-6 rounded-[10px] font-normal text-base leading-[150%] border-[#06d6a0] text-[#06d6a0]">
              Lisa kuulutus tasuta
            </button>
          </div>
        </section>

        {/* Search Section */}
        <section className="px-5 py-6 max-w-7xl mx-auto relative">
          <div className="flex items-center">
            <div className="bg-white p-3 rounded-md shadow-sm cursor-pointer relative z-20" onClick={() => setFilterOpen((v) => !v)}>
              <span className="text-black font-medium">Filtrid</span>
            </div>
            <div className="flex-1 relative w-full pl-[10px]">
              <div className="bg-white border rounded-md px-3 py-3 flex items-center shadow-sm w-full">
                <Search className="w-4 h-4 text-black" />
                <input
                  type="text"
                  placeholder="Otsing"
                  className="flex-1 text-motors-gray placeholder:text-motors-gray pl-1 outline-none"
                />
              </div>
            </div>
          </div>
          {filterOpen && (
            <div
              ref={filterRef}
              className="absolute left-0 mt-2 w-3/4 bg-white rounded-[10px] shadow-lg z-30"
            >
              <CarListingSection />
            </div>
          )}
        </section>

        {/* Car Listings */}
        <section className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {cars.map((car, index) => (
              <div className={filterOpen ? "blur-sm transition-all duration-300" : "transition-all duration-300"} key={car.id}>
                <CarCard
                  {...car}
                />
              </div>
            ))}
          </div>

          <div className="pt-6 max-w-md mx-auto">
            <button className="w-full border border-motors-green text-motors-green py-4 px-6 rounded-[10px] font-normal text-base leading-[150%] tracking-[-0.32px]">
              Näita rohkem autosid
            </button>
          </div>
        </section>

        {/* Blog Section */}
        <section className="px-5 py-12">
          <div className="mb-12 max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
              Blog
            </h2>
            <p className="text-motors-dark leading-[150%] tracking-[-0.48px] max-w-md">
              Lorem ipsum dolor sit amet consectetur. Quisque erat imperdiet
              egestas pretium. Nibh convallis id nulla non diam.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {blogPosts.map((post) => (
              <BlogCard key={post.id} {...post} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
import { Heart, Fuel } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../../hooks/useFavorites";
import { useAuth } from "../../contexts/AuthContext";
interface CarCardProps {
  id: number;
  title: string;
  year: number;
  mileage: string;
  price: string;
  fuel: string;
  transmission: string;
  image: string;
  isFavorite?: boolean;
}

export function CarCard({
  id,
  title,
  year,
  mileage,
  price,
  fuel,
  transmission,
  image,
  isFavorite = false,
}: CarCardProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isFavorite: isFav, toggleFavorite } = useFavorites();
  return (
    <div className="bg-white rounded-[13px] overflow-hidden shadow-sm w-full max-w-md mx-auto"
    onClick={() => {
      navigate(`/car/${id}`);
      window.scrollTo(0, 0);
    }}>
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-[200px] md:h-[247px] object-cover"
        />
      </div>

      <div className="p-4 md:p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-motors-dark mb-1 leading-[30px] tracking-[-0.6px]">
              {title}
            </h3>
            <p className="text-lg text-motors-gray font-medium leading-[27px] tracking-[-0.36px]">
              {year}, {mileage}
            </p>
          </div>
          <button 
            className="ml-4"
            onClick={(e) => {
              e.stopPropagation();
              if (!isAuthenticated) {
                alert('Please log in to save favorites');
                return;
              }
              toggleFavorite(id);
            }}
          >
            <Heart
              className={`w-[30px] h-[30px] ${
                isFav(id) ? "fill-red-500 text-red-500" : "text-gray-400"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center gap-6 mb-4">
          <div className="flex items-center gap-2.5">
            <Fuel className="w-6 h-6 text-black" />
            <span className="text-motors-gray tracking-[-0.32px]">{fuel}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 relative">
              <div className="w-5 h-5 bg-black rounded-full absolute top-0.5 left-0.5"></div>
              <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"></div>
              <div className="w-3 h-3 bg-black rounded-full absolute top-1.5 left-1.5"></div>
              <div className="w-2 h-2 bg-white rounded-full absolute top-2 left-2"></div>
              <div className="w-0.5 h-1 bg-black absolute bottom-0 left-3"></div>
              <div className="w-1 h-0.5 bg-black absolute right-0 top-3"></div>
              <div className="w-1 h-0.5 bg-black absolute left-0.5 top-3"></div>
            </div>
            <span className="text-motors-gray tracking-[-0.32px]">
              {transmission}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl md:text-2xl font-semibold text-motors-dark">
            {price}
          </span>
          <button 
            className="bg-brand-primary text-white px-6 md:px-10 py-3 md:py-4 rounded-[13px] font-normal tracking-[-0.32px] text-sm md:text-base"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/car/${id}`);
              window.scrollTo(0, 0);
            }}
          >
            Vaata
          </button>
        </div>
      </div>
    </div>
  );
}

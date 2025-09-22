import { HeartIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

export const VehicleDetailsSection = (): JSX.Element => {
  const navigate = useNavigate();
  
  // Vehicle data for mapping
  const vehicles = [
    {
      id: 1,
      model: "Volkswagen Touareg",
      year: "2016",
      mileage: "303 000 km",
      fuelType: "Diisel",
      transmission: "Automaat",
      price: "€ 15 900",
      image: "/img/Rectangle 34624924.png",
    },
    {
      id: 2,
      model: "Volkswagen Touareg",
      year: "2016",
      mileage: "303 000 km",
      fuelType: "Diisel",
      transmission: "Automaat",
      price: "€ 15 900",
      image: "/img/Rectangle 34624924.png",
    },
    {
      id: 3,
      model: "Volkswagen Touareg",
      year: "2016",
      mileage: "303 000 km",
      fuelType: "Diisel",
      transmission: "Automaat",
      price: "€ 15 900",
      image: "/img/Rectangle 34624924.png",
    },
    {
      id: 4,
      model: "Volkswagen Touareg",
      year: "2016",
      mileage: "303 000 km",
      fuelType: "Diisel",
      transmission: "Automaat",
      price: "€ 15 900",
      image: "/img/Rectangle 34624924.png",
    },
    {
      id: 5,
      model: "Volkswagen Touareg",
      year: "2016",
      mileage: "303 000 km",
      fuelType: "Diisel",
      transmission: "Automaat",
      price: "€ 15 900",
      image: "/img/Rectangle 34624924.png",
    },
    {
      id: 6,
      model: "Volkswagen Touareg",
      year: "2016",
      mileage: "303 000 km",
      fuelType: "Diisel",
      transmission: "Automaat",
      price: "€ 15 900",
      image: "/img/Rectangle 34624924.png",
    },
    {
      id: 7,
      model: "Volkswagen Touareg",
      year: "2016",
      mileage: "303 000 km",
      fuelType: "Diisel",
      transmission: "Automaat",
      price: "€ 15 900",
      image: "/img/Rectangle 34624924.png",
    },
    {
      id: 8,
      model: "Volkswagen Touareg",
      year: "2016",
      mileage: "303 000 km",
      fuelType: "Diisel",
      transmission: "Automaat",
      price: "€ 15 900",
      image: "/img/Rectangle 34624924.png",
    },
  ];

  // Grid positions for each card
  const gridPositions = [
    { row: "top-[118px]", col: "left-0" },
    { row: "top-[524px]", col: "left-0" },
    { row: "top-[118px]", col: "left-[313px]" },
    { row: "top-[524px]", col: "left-[313px]" },
    { row: "top-[118px]", col: "left-[626px]" },
    { row: "top-[524px]", col: "left-[626px]" },
    { row: "top-[118px]", col: "left-[939px]" },
    { row: "top-[524px]", col: "left-[939px]" },
  ];

  return (
    <section className="relative w-full mx-auto py-12">
      <h2 className="font-semibold text-[46px] text-black [font-family:'Poppins',Helvetica] mb-12">
        Vaata viimast autot
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {vehicles.map((vehicle, index) => (
          <Card
            key={vehicle.id}
            className="w-full max-w-[298px] h-[376px] bg-white rounded-[10px] overflow-hidden relative cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/car/${vehicle.id}`)}
          >
            <CardContent className="p-0">
              <img
                className="w-full h-[189px] object-cover"
                alt={`${vehicle.model}`}
                src={vehicle.image}
              />

              <div className="flex flex-col items-start gap-1 p-5 pt-5 relative">
                <div className="flex justify-between items-start w-full">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-secondary-500 text-lg tracking-[-0.54px] leading-[27px] [font-family:'Poppins',Helvetica]">
                      {vehicle.model}
                    </h3>
                    <p className="font-medium text-[#747474] text-sm tracking-[-0.28px] leading-[21px] [font-family:'Poppins',Helvetica]">
                      {vehicle.year}, {vehicle.mileage}
                    </p>
                  </div>
                  <button className="flex items-center justify-center">
                    <HeartIcon className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                <div className="flex items-center gap-5 mt-4">
                  <div className="flex items-center gap-2">
                    <img
                      className="w-5 h-5"
                      alt="Gas station icon"
                      src="/img/vuesax-bold-gas-station.svg"
                    />
                    <span className="font-normal text-[#747474] text-sm tracking-[-0.28px] leading-[21px] [font-family:'Poppins',Helvetica]">
                      {vehicle.fuelType}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative w-5 h-5">
                    <img className="w-6 h-6" alt="Google logo" src="/img/car/bevel.svg" />
                    </div>
                    <span className="font-normal text-[#747474] text-sm tracking-[-0.28px] leading-[21px] [font-family:'Poppins',Helvetica]">
                      {vehicle.transmission}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center w-full mt-4">
                  <p className="font-semibold text-secondary-500 text-xl [font-family:'Poppins',Helvetica]">
                    {vehicle.price}
                  </p>
                  <Button 
                    className="h-10 px-[30px] py-3 bg-[#06d6a0] text-primary-0 rounded-[10px] hover:bg-[#05c090]"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/car/${vehicle.id}`);
                    }}
                  >
                    <span className="font-normal text-base text-center text-white tracking-[-0.32px] leading-6 [font-family:'Poppins',Helvetica]">
                      Vaata
                    </span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

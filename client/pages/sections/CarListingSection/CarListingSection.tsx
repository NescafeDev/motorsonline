import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Checkbox } from "../../../components/ui/checkbox";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Separator } from "../../../components/ui/separator";
import { Combobox } from "../../../components/ui/combobox";
import axios from "axios";
import { Car } from "lucide-react";

// Import CarFilters from HomePage
export interface CarFilters {
  vehicleType?: string;
  technicalData?: string;
  brand_id?: number;
  model_id?: number;
  model_name?: string;
  trim_level?: string;
  category?: string;
  drive_type_id?: number[];
  seats_min?: number;
  seats_max?: number;
  doors_min?: number;
  doors_max?: number;
  price_min?: number;
  price_max?: number;
  year_min?: number;
  year_max?: number;
  mileage_min?: number;
  mileage_max?: number;
  power_min?: number;
  power_max?: number;
  engine_min?: number;
  engine_max?: number;
  fuel_city_min?: number;
  fuel_city_max?: number;
  fuel_highway_min?: number;
  fuel_highway_max?: number;
  fuel_average_min?: number;
  fuel_average_max?: number;
  co2_min?: number;
  co2_max?: number;
  fuel_type?: string[];
  transmission?: string[];
  color?: string;
  country?: string;
  registered_country?: string;
  imported_from?: string;
  seller_type?: string;
  with_vat?: boolean;
  service_book?: boolean;
  inspection?: boolean;
  accident_free?: boolean;
  metallic_paint?: boolean;
  exchange_possible?: boolean;
  with_warranty?: boolean;
  equipment?: string[];
  carColorType?: string;
  carColor?: string;
  bodyType?: string;
}

interface CarListingSectionProps {
  filters: CarFilters;
  onFiltersChange: (filters: CarFilters) => void;
  onApplyFilters: () => void;
  navigateToSearch?: boolean; // New prop to control navigation behavior
  isMobile?: boolean; // New prop to control mobile-specific styling
}

// API client with same configuration as HomePage
const apiClient = axios.create({
  baseURL: "",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const CarListingSection = ({
  filters,
  onFiltersChange,
  onApplyFilters,
  navigateToSearch = false,
  isMobile = false,
}: CarListingSectionProps): JSX.Element => {
  const navigate = useNavigate();
  const { t, currentLanguage } = useI18n();
  const currentLang = currentLanguage;
  // Data for drive types - will be fetched from API
  const [driveTypes, setDriveTypes] = useState<{ id: number; name: string; ee_name: string }[]>([]);

  // Data for brands and models
  const [brands, setBrands] = useState<{ id: number; name: string }[]>([]);
  const [models, setModels] = useState<{ id: number; name: string; brand_id: number }[]>([]);
  const [filteredModels, setFilteredModels] = useState<{ id: number; name: string; brand_id: number }[]>([]);

  // Loading states
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [modelsLoading, setModelsLoading] = useState(true);

  // Fetch drive types on component mount
  useEffect(() => {
    const fetchDriveTypes = async () => {
      try {
        const response = await apiClient.get('/api/drive-types');
        setDriveTypes(response.data);
      } catch (error) {
        console.error('Error fetching drive types:', error);
      }
    };
    fetchDriveTypes();
  }, []);

  // Fetch brands on component mount
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setBrandsLoading(true);
        const response = await apiClient.get('/api/brands');
        setBrands(response.data);
      } catch (error) {
        console.error('Error fetching brands:', error);
        setBrands([]);
      } finally {
        setBrandsLoading(false);
      }
    };
    fetchBrands();
  }, []);

  // Fetch all models on component mount
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setModelsLoading(true);
        const response = await apiClient.get('/api/models?brand_id=all');
        setModels(response.data);
      } catch (error) {
        console.error('Error fetching models:', error);
        setModels([]);
      } finally {
        setModelsLoading(false);
      }
    };
    fetchModels();
  }, []);

  // Filter models based on selected brand
  useEffect(() => {
    if (filters.brand_id) {
      const filtered = models.filter(model => model.brand_id === filters.brand_id);
      setFilteredModels(filtered);
    } else {
      setFilteredModels([]);
    }
  }, [filters.brand_id, models]);

  // Debug effect to log when brands are loaded and filters change
  useEffect(() => {
    if (brands.length > 0 && filters.brand_id) {
      const foundBrand = brands.find(brand => brand.id === filters.brand_id);
      if (!foundBrand) {
        console.warn(`Brand with ID ${filters.brand_id} not found in loaded brands`);
      }
    }
  }, [brands, filters.brand_id]);

  // Data for fuel types
  const fuelTypes = [
    { id: "bensiin", label: t('fuelTypes.gasoline') },
    { id: "diisel", label: t('fuelTypes.diesel') },
    { id: "elekter", label: t('fuelTypes.electric') },
    { id: "hübriid (bensiin/elekter)", label: t('fuelTypes.hybridGasolineElectric') },
    { id: "hübriid (diisel/elekter)", label: t('fuelTypes.hybridDieselElectric') },
    { id: "pistikhübriid (bensiin/elekter)", label: t('fuelTypes.plugInHybridGasolineElectric') },
    { id: "pistikhübriid (diisel/elekter)", label: t('fuelTypes.plugInHybridDieselElectric') },
    { id: "bensiin + gaas (LPG/vedelgaas)", label: t('fuelTypes.gasolineLPG') },
    { id: "bensiin + gaas (CNG/surugaas)", label: t('fuelTypes.gasolineCNG') },
    { id: "bensiin + gaas (LNG/veeldatud maagaas)", label: t('fuelTypes.gasolineLNG') },
    { id: "diisel + gaas (LNG/veeldatud maagaas)", label: t('fuelTypes.dieselLNG') },
    { id: "gaas (LPG/vedelgaas)", label: t('fuelTypes.gasLPG') },
    { id: "gaas (CNG/surugaas)", label: t('fuelTypes.gasCNG') },
    { id: "gaas (LNG/veeldatud maagaas)", label: t('fuelTypes.gasLNG') },
    { id: "vesinik", label: t('fuelTypes.hydrogen') },
  ];

  // Data for transmission types
  const transmissionTypes = [
    { id: "manuaal", label: t('transmissionTypes.manual') },
    { id: "automaat", label: t('transmissionTypes.automatic') },
    { id: "pool automaat", label: t('transmissionTypes.semiAutomatic') },
  ];

  const vehicleType = [
    { id: "vali", label: t('common.select') },
    { id: "sõiduauto", label: t('vehicleTypes.passengerCar') },
    { id: "maastur", label: t('vehicleTypes.suv') },
    { id: "kaubik", label: t('vehicleTypes.van') },
    { id: "buss", label: t('vehicleTypes.bus') },
    { id: "veoauto", label: t('vehicleTypes.truck') },
    { id: "haagis", label: t('vehicleTypes.trailer') },
    { id: "mototehnika", label: t('vehicleTypes.motorcycle') },
    { id: "haagissuvila", label: t('vehicleTypes.caravan') },
    { id: "autoelamu", label: t('vehicleTypes.motorhome') },
    { id: "veesõiduk", label: t('vehicleTypes.watercraft') },
    { id: "ehitustehnika", label: t('vehicleTypes.constructionMachinery') },
    { id: "põllumajandustehnika", label: t('vehicleTypes.agriculturalMachinery') },
    { id: "metsatehnika", label: t('vehicleTypes.forestryMachinery') },
    { id: "kommunaaltehnika", label: t('vehicleTypes.utilityMachinery') },
    { id: "võistlussõiduk", label: t('vehicleTypes.competitionVehicle') },
    { id: "muu", label: t('vehicleTypes.other') },
  ];

  const [showAllEquipment, setShowAllEquipment] = useState(false);

  const bodyType = [
    { id: "vali", label: t('common.select') },
    { id: "sedaan", label: t('bodyTypes.sedan') },
    { id: "luukpara", label: t('bodyTypes.hatchback') },
    { id: "universaal", label: t('bodyTypes.wagon') },
    { id: "mahtuniversaal", label: t('bodyTypes.mpv') },
    { id: "kupee", label: t('bodyTypes.coupe')},
    { id: "kabriolett", label: t('bodyTypes.convertible') },
    { id: "pikap", label: t('bodyTypes.pickup') },
    { id: "limusiin", label: t('bodyTypes.limousine') },
  ]

  // Data for vehicle condition
  const technicalData = [
    { id: "vali", label: t('common.select') },
    { id: "uus", label: t('vehicleCondition.new') },
    { id: "kasutatud", label: t('vehicleCondition.used') },
    { id: "avariiline", label: t('vehicleCondition.damaged') },
  ];
  // Data for category types
  const categoryTypes = [
    { id: "vali", label: t('common.select') },
    { id: "M1", label: "M1" },
    { id: "M2", label: "M2" },
    { id: "M3", label: "M3" },
    { id: "N1", label: "N1" },
    { id: "N2", label: "N2" },
    { id: "N3", label: "N3" },
    { id: "L1e", label: "L1e" },
    { id: "L2e", label: "L2e" },
    { id: "L3e", label: "L3e" },
    { id: "L4e", label: "L4e" },
    { id: "L5e", label: "L5e" },
    { id: "L6e", label: "L6e" },
    { id: "L7e", label: "L7e" },
    { id: "O1", label: "O1" },
    { id: "O2", label: "O2" },
    { id: "O3", label: "O3" },
    { id: "O4", label: "O4" },
  ];

  // Data for colors - expanded array with 48 colors
  const allColors = [
    { id: "beež", label: t('colors.beige'), color: "bg-yellow-100" },
    { id: "hall", label: t('colors.grey'), color: "bg-gray-500" },
    { id: "helebeež", label: t('colors.lightBeige'), color: "bg-yellow-50" },
    { id: "helehall", label: t('colors.lightGrey'), color: "bg-gray-300" },
    { id: "hellkollane", label: t('colors.lightYellow'), color: "bg-yellow-200" },
    { id: "helelilla", label: t('colors.lightPurple'), color: "bg-purple-200" },
    { id: "heleanž", label: t('colors.lightOrange'), color: "bg-orange-200" },
    { id: "helepruun", label: t('colors.lightBrown'), color: "bg-amber-200" },
    { id: "helepunane", label: t('colors.lightRed'), color: "bg-red-200" },
    { id: "heleroheline", label: t('colors.brown'), color: "bg-green-200" },
    { id: "helesinine", label: t('colors.lightBlue'), color: "bg-blue-200" },
    { id: "hõbedane", label: t('colors.silver'), color: "bg-gray-200" },
    { id: "kollane", label: t('colors.yellow'), color: "bg-yellow-400" },
    { id: "kuldne", label: t('colors.golden'), color: "bg-yellow-500" },
    { id: "lilla", label: t('colors.purple'), color: "bg-purple-500" },
    { id: "heleoranž", label: t('colors.lightOrange'), color: "bg-orange-200" },
    { id: "must", label: t('colors.black'), color: "bg-black" },
    { id: "oranž", label: t('colors.orange'), color: "bg-orange-500" },
    { id: "pruun", label: t('colors.brown'), color: "bg-amber-700" },
    { id: "punane", label: t('colors.red'), color: "bg-red-500" },
    { id: "roheline", label: t('colors.green'), color: "bg-green-500" },
    { id: "roosa", label: t('colors.pink'), color: "bg-pink-400" },
    { id: "sinine", label: t('colors.blue'), color: "bg-blue-500" },
    { id: "tumebeež", label: t('colors.darkBeige'), color: "bg-yellow-600", },
    { id: "tumehall", label: t('colors.darkGrey'), color: "bg-gray-700" },
    { id: "tumekollane", label: t('colors.darkYellow'), color: "bg-yellow-600" },
    { id: "tumelilla", label: t('colors.darkPurple'), color: "bg-purple-700" },
    { id: "tumeoranž", label: t('colors.darkOrange'), color: "bg-orange-600" },
    { id: "tumerpruun", label: t('colors.darkBrown'), color: "bg-amber-800" },
    { id: "tumerpunane", label: t('colors.darkRed'), color: "bg-red-700" },
    { id: "tumeroheline", label: t('colors.darkGreen') , color: "bg-green-700" },
    { id: "tumesinine", label: t('colors.darkBlue'), color: "bg-blue-700" },
    { id: "valge", label: t('colors.white'), color: "bg-white", },
  ];

  // State to control showing all colors or just initial 6
  const [showAllColors, setShowAllColors] = useState(false);

  // Get colors to display based on state
  const colorsToShow = showAllColors ? allColors : allColors.slice(0, 6);

  // Convert colors to rows for display (2 colors per row)
  const colorRows = [];
  for (let i = 0; i < colorsToShow.length; i += 2) {
    colorRows.push(colorsToShow.slice(i, i + 2));
  }

  // Data for additional info
  const additionalInfo = [
    { id: "vahetuse-voimalus", label: t('common.exchangepossible'), filterKey: "exchange_possible" },
    { id: "garantiiga", label: t('common.warranty'), filterKey: "with_warranty" },
  ];

  // Data for equipment
  const accessoriesOptions = [
    { key: 'kokkupõrgetennetavpidurisüsteem', label: t('carFeatures.collisionPreventionBrakingSystem') },
    { key: 'pimenurgahoiatus', label: t('carFeatures.blindSpotWarning') },
    { key: 'sõidurajahoidmiseabisüsteem', label: t('carFeatures.laneKeepingAssistSystem') },
    { key: 'sõidurajavahetamiseabisüsteem', label: t('carFeatures.laneChangeAssistSystem') },
    { key: 'adaptiivnepüsikiirusehoidja', label: t('carFeatures.adaptiveCruiseControl') },
    { key: 'liiklusmärkidetuvastusjakuvamine', label: t('carFeatures.trafficSignRecognition') },
    { key: 'parkimisandurideesjataga', label: t('carFeatures.parkingSensorsFrontRear') },
    { key: 'parkimiskaamera', label: t('carFeatures.parkingCamera') },
    { key: 'parkimiskaamera360', label: t('carFeatures.parkingCamera360') },
    { key: 'kaugtuledeümberlülitamiseassistent', label: t('carFeatures.highBeamAssist') },
    { key: 'LEDesituled', label: t('carFeatures.ledHeadlights') },
    { key: 'Xenonesituled', label: t('carFeatures.xenonHeadlights') },
    { key: 'lasersituled', label: t('carFeatures.laserHeadlights') },
    { key: 'elektriliseoojendusegaesiklaas', label: t('carFeatures.heatedWindscreen') },
    { key: 'kliimaseade', label: t('carFeatures.airConditioning') },
    { key: 'salongieelsoojendus', label: t('carFeatures.cabinPreheater') },
    { key: 'mootorieelsoojendus', label: t('carFeatures.enginePreheater') },
    { key: 'salongilisaoojendus', label: t('carFeatures.additionalCabinHeater') },
    { key: 'istmesoojendused', label: t('carFeatures.seatHeating') },
    { key: 'elektriliseltreguleeritavadIstmed', label: t('carFeatures.electricSeats') },
    { key: 'comfortistmed', label: t('carFeatures.comfortSeats') },
    { key: 'sportistmed', label: t('carFeatures.sportSeats') },
    { key: 'nahkpolster', label: t('carFeatures.leatherUpholstery') },
    { key: 'poolnahkpolster', label: t('carFeatures.semiLeatherUpholstery') },
    { key: 'tagaistmeseljatugiallaklapitav', label: t('carFeatures.rearSeatBackFoldable') },
    { key: 'eraldikliimaseadetagaistmetele', label: t('carFeatures.rearSeatIndependentClimate') },
    { key: 'võtmetavamine', label: t('carFeatures.keylessEntry') },
    { key: 'võtmetaäivitus', label: t('carFeatures.keylessStart') },
    { key: 'pakiruumiavaminejasulgeminelektriliselt', label: t('carFeatures.powerTailgate') },
    { key: 'soojendusegarool', label: t('carFeatures.heatedSteeringWheel') },
    { key: 'ventileeritavadstmed', label: t('carFeatures.ventilatedSeats') },
    { key: 'massaažifunktsioonigaiistmed', label: t('carFeatures.massageSeats') },
    { key: 'infokuvamineesiklaasile', label: t('carFeatures.headUpDisplay') },
    { key: 'panoraamkatusklaasist', label: t('carFeatures.panoramicRoof') },
    { key: 'katuseluuk', label: t('carFeatures.sunroof') },
    { key: 'usteservosulgurid', label: t('carFeatures.softCloseDoors') },
    { key: 'topeltklaasid', label: t('carFeatures.doubleGlazing') },
    { key: 'rulookardinadustel', label: t('carFeatures.doorSunblinds') },
    { key: 'integreeritudVäravapult', label: t('carFeatures.integratedGarageRemote') },
    { key: 'AppleCarPlay', label: 'Apple CarPlay' },
    { key: 'AndroidAuto', label: 'Android Auto' },
    { key: 'stereo', label: t('carFeatures.stereo') },
    { key: 'õhkvedrustus', label: t('carFeatures.airSuspension') },
    { key: 'reguleeritavvedrustus', label: t('carFeatures.adjustableSuspension') },
    { key: '4-rattapööramine', label: t('carFeatures.fourWheelSteering') },
    { key: 'veokonks', label: t('carFeatures.towHook') },
    { key: 'elektrilisedliuguksed', label: t('carFeatures.powerSlidingDoors') },
    { key: 'öiseNägemiseassistent', label: t('carFeatures.nightVisionAssistant') },
    { key: 'valgustuspakett', label: t('carFeatures.lightingPackage') },
    { key: 'suverehvid', label: t('carFeatures.summerTires') },
    { key: 'talverehvid', label: t('carFeatures.winterTires') },
    { key: 'valuveljed', label: t('carFeatures.alloyWheels') },
  ];

  // Range input groups
  const rangeInputGroups = [
    { id: "price", label: t('car.price'), minKey: "price_min", maxKey: "price_max" },
    { id: "year", label: t('car.year'), minKey: "year_min", maxKey: "year_max" },
    { id: "mileage", label: t('carSpecs.mileage') + " (km)", minKey: "mileage_min", maxKey: "mileage_max" },
    { id: "seats", label: t('formLabels.seats'), minKey: "seats_min", maxKey: "seats_max" },
    { id: "doors", label: t('formLabels.doors'), minKey: "doors_min", maxKey: "doors_max" },
    { id: "power", label: t('carSpecs.power') + " (kw)", minKey: "power_min", maxKey: "power_max" },
    { id: "engine", label: t('car.engine'), minKey: "engine_min", maxKey: "engine_max" },
    { id: "fuel-city", label: t('carSpecs.fuelCity') + " (100km)", minKey: "fuel_city_min", maxKey: "fuel_city_max" },
    { id: "fuel-highway", label: t('carSpecs.fuelHighway') + " (100km)", minKey: "fuel_highway_min", maxKey: "fuel_highway_max" },
    { id: "fuel-average", label: t('carSpecs.fuelAverage') + " (100km)", minKey: "fuel_average_min", maxKey: "fuel_average_max" },
    { id: "co2", label: t('car.co2'), minKey: "co2_min", maxKey: "co2_max" },
  ];

  const [selectedColor, setSelectedColor] = useState<string | null>(filters.carColor || null);

  // Sync selectedColor with filters.carColor
  useEffect(() => {
    setSelectedColor(filters.carColor || null);
  }, [filters.carColor]);

  // Helper function to update filters
  const updateFilter = (key: keyof CarFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  // Helper function to handle brand selection
  const handleBrandChange = (brandId: string) => {
    if (brandId === "") {
      updateFilter('brand_id', undefined);
      // updateFilter('model_id', undefined);
    } else {
      const brandIdNum = Number(brandId);
      updateFilter('brand_id', brandIdNum);
      // Clear model selection when brand changes
      // updateFilter('model_id', undefined);
    }
  };

  // Helper function to update range filters
  const updateRangeFilter = (minKey: keyof CarFilters, maxKey: keyof CarFilters, minValue: string | number, maxValue: string | number) => {
    const updates: Partial<CarFilters> = {};
    if (minValue) {
      (updates as any)[minKey] = Number(minValue);
    }
    if (maxValue) {
      (updates as any)[maxKey] = Number(maxValue);
    }
    onFiltersChange({ ...filters, ...updates });
  };

  // Helper function to handle checkbox arrays
  const handleArrayFilter = (key: keyof CarFilters, value: string, checked: boolean) => {
    const currentArray = (filters[key] as string[]) || [];
    const newArray = checked
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value);
    updateFilter(key, newArray);
  };

  // Helper function to handle number array filters (for drive_type_id)
  const handleNumberArrayFilter = (key: keyof CarFilters, value: number, checked: boolean) => {
    const currentArray = (filters[key] as number[]) || [];
    const newArray = checked
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value);
    updateFilter(key, newArray);
  };

  // Helper function to handle boolean filters
  const handleBooleanFilter = (key: keyof CarFilters, checked: boolean) => {
    updateFilter(key, checked);
  };

  return (
    <div className={isMobile ? "w-full" : "w-[300px]"} onClick={(e) => e.stopPropagation()}>
      <Card className="rounded-[10px] h-full flex flex-col w-full">
        <CardContent className="p-5 space-y-4 flex-1">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-xl font-['Poppins',Helvetica]">
              {t('search.filters')}
            </h2>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Close the filter panel by calling the parent's close function
                // This will be handled by the parent component
                const event = new CustomEvent('closeFilters');
                window.dispatchEvent(event);
              }}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors md:hidden"
              aria-label="Close filters"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Sõiduki liik Section - First */}
          <div className="space-y-3">
            <Select
              value={filters.vehicleType || ""}
              onValueChange={(value) => {
                if (value === "vali") {
                  updateFilter('vehicleType', undefined);
                } else {
                  updateFilter('vehicleType', value);
                }
              }}
            >
              <SelectTrigger className="w-full h-[43px] bg-[#f6f7f9] font-['Poppins',Helvetica] text-[#747474]">
                <SelectValue placeholder={t('formLabels.vehicleType')} />
              </SelectTrigger>
              <SelectContent>
                {vehicleType.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Select
              value={filters.bodyType || ""}
              onValueChange={(value) => {
                if (value === "vali") {
                  updateFilter('bodyType', undefined);
                } else {
                  updateFilter('bodyType', value);
                }
              }}
            >
              <SelectTrigger className="w-full h-[43px] bg-[#f6f7f9] font-['Poppins',Helvetica] text-[#747474]">
                <SelectValue placeholder={t('formLabels.bodyType')} />
              </SelectTrigger>
              <SelectContent>
                {bodyType.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Kategooria Section - Second */}
          <div className="space-y-3">
            <Select
              value={filters.category || ""}
              onValueChange={(value) => {
                if (value === "vali") {
                  updateFilter('category', undefined);
                } else {
                  updateFilter('category', value);
                }
              }}
            >
              <SelectTrigger className="w-full h-[43px] bg-[#f6f7f9] font-['Poppins',Helvetica] text-[#747474]">
                <SelectValue placeholder={t('blog.category')} />
              </SelectTrigger>
              <SelectContent>
                {categoryTypes.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sõiduki seisukord Section - Third */}
          <div className="space-y-3">
            <Select
              value={filters.technicalData || ""}
              onValueChange={(value) => {
                if (value === "vali") {
                  updateFilter('technicalData', undefined);
                } else {
                  updateFilter('technicalData', value);
                }
              }}
            >
              <SelectTrigger className="w-full h-[43px] bg-[#f6f7f9] font-['Poppins',Helvetica] text-[#747474]">
                <SelectValue placeholder={t('formLabels.vehicleCondition')} />
              </SelectTrigger>
              <SelectContent>
                {technicalData.map((condition) => (
                  <SelectItem key={condition.id} value={condition.id}>
                    {condition.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>


          {/* Make and Model Selectors */}
          <div className="space-y-3">
            {brandsLoading ? (
              <div className="h-[43px] bg-[#f6f7f9] flex items-center justify-center text-[#747474]">
                {t('common.loading')}
              </div>
            ) : (
              <Combobox
                className="font-normal"
                options={brands.map(brand => ({ value: brand.id.toString(), label: brand.name }))}
                value={filters.brand_id?.toString() || ""}
                onValueChange={handleBrandChange}
                placeholder={t('formLabels.brand')}
                searchPlaceholder="Otsi marki..."
                emptyMessage={t('uiActions.brandNotFound')}
              />
            )}

            {modelsLoading ? (
              <div className="h-[43px] bg-[#f6f7f9] flex items-center justify-center text-[#747474]">
                {t('common.loading')}
              </div>
            ) : (
              <Combobox
                className="font-normal"
                options={filteredModels.map(model => ({ value: model.id.toString(), label: model.name }))}
                value={filters.model_id?.toString() || ""}
                onValueChange={(value) => {
                  if (value === "") {
                    updateFilter('model_id', undefined);
                  } else {
                    updateFilter('model_id', Number(value));
                  }
                }}
                placeholder={t('formLabels.model')}
                searchPlaceholder={t('common.search')}
                emptyMessage={t('uiActions.modelNotFound')}
                disabled={filters.brand_id === undefined || filters.brand_id === null}
              />
            )}

            <Input
              className="h-[43px] bg-[#f6f7f9] font-['Poppins',Helvetica] text-[#747474] border-none"
              placeholder={t('common.modelName')}
              value={filters.model_name || ''}
              onChange={(e) => updateFilter('model_name', e.target.value)}
            />

            <Input
              className="h-[43px] bg-[#f6f7f9] font-['Poppins',Helvetica] text-[#747474] border-none"
              placeholder={t('common.equipmentLevelVersion')}
              value={filters.trim_level || ''}
              onChange={(e) => updateFilter('trim_level', e.target.value)}
            />
          </div>

          <Separator className="my-2" />

          {/* Drive Type Section */}
          <Accordion type="single" collapsible>
            <AccordionItem value="drive-type" className="border-none">
              <AccordionTrigger className="py-2 font-medium text-base font-['Poppins',Helvetica]">
                {t('formLabels.driveType')}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {driveTypes.map((type) => (
                    <div key={type.id} className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        id={type.id.toString()}
                        className="w-6 h-6 rounded border-[#ababab]"
                        checked={(filters.drive_type_id || []).includes(type.id)}
                        onCheckedChange={(checked) => handleNumberArrayFilter('drive_type_id', type.id, checked as boolean)}
                      />
                      <label
                        htmlFor={type.id.toString()}
                        className="font-['Poppins',Helvetica] font-normal text-base"
                      >
                        {type.name === 'esivedu' ? t('driveTypes.frontWheel') :
                         type.name === 'tagavedu' ? t('driveTypes.rearWheel') :
                         type.name === 'nelikvedu' ? t('driveTypes.allWheel') :
                         type.ee_name}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator className="my-2" />

          {/* Range Input Groups */}
          {/* <Accordion type="single" collapsible defaultValue="range-input-groups"> */}
          <Accordion type="single" collapsible>
            <AccordionItem value="range-input-groups" className="border-none">
              <AccordionTrigger className="py-2 font-medium text-base font-['Poppins',Helvetica]">
                {t('formLabels.priceAndGeneralInfo')}
              </AccordionTrigger>
              <AccordionContent>
                {rangeInputGroups.slice(0, 5).map((group) => (
                  <div key={group.id} className="space-y-2">
                    <label className="block font-['Poppins',Helvetica] font-normal text-[#747474] text-base">
                      {group.label}
                    </label>
                    <div className="flex items-center space-x-2">
                      <Input
                        className="w-[109px] h-[43px] bg-[#f6f7f9] font-['Poppins',Helvetica] text-[#747474]"
                        placeholder={t('common.from')}
                        value={filters[group.minKey as keyof CarFilters]?.toString() || ''}
                        onChange={(e) => updateRangeFilter(
                          group.minKey as keyof CarFilters,
                          group.maxKey as keyof CarFilters,
                          e.target.value,
                          filters[group.maxKey as keyof CarFilters]?.toString() || ''
                        )}
                      />
                      <span className="font-['Poppins',Helvetica] font-normal text-base">
                        -
                      </span>
                      <Input
                        className="w-[109px] h-[43px] bg-[#f6f7f9] font-['Poppins',Helvetica] text-[#747474]"
                        placeholder={t('common.to')}
                        value={filters[group.maxKey as keyof CarFilters]?.toString() || ''}
                        onChange={(e) => updateRangeFilter(
                          group.minKey as keyof CarFilters,
                          group.maxKey as keyof CarFilters,
                          filters[group.minKey as keyof CarFilters]?.toString() || '',
                          e.target.value
                        )}
                      />
                    </div>
                  </div>
                ))}
                <div className="space-y-2 mt-4">
                  <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      id="kaibemaksuga"
                      className="w-6 h-6 rounded border-[#ababab]"
                      checked={filters.with_vat || false}
                      onCheckedChange={(checked) => handleBooleanFilter('with_vat', checked as boolean)}
                    />
                    <label
                      htmlFor="kaibemaksuga"
                      className="font-['Poppins',Helvetica] font-normal text-base"
                    >
                      {t('formLabels.withVAT')}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      id="hooldusraamat"
                      className="w-6 h-6 rounded border-[#ababab]"
                      checked={filters.service_book || false}
                      onCheckedChange={(checked) => handleBooleanFilter('service_book', checked as boolean)}
                    />
                    <label
                      htmlFor="hooldusraamat"
                      className="font-['Poppins',Helvetica] font-normal text-base"
                    >
                      {t('formLabels.serviceBook')}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      id="ulevaatus"
                      className="w-6 h-6 rounded border-[#ababab]"
                      checked={filters.inspection || false}
                      onCheckedChange={(checked) => handleBooleanFilter('inspection', checked as boolean)}
                    />
                    <label
                      htmlFor="ulevaatus"
                      className="font-['Poppins',Helvetica] font-normal text-base"
                    >
                      {t('formLabels.inspection')}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      id="avariiline"
                      className="w-6 h-6 rounded border-[#ababab]"
                      checked={filters.accident_free || false}
                      onCheckedChange={(checked) => handleBooleanFilter('accident_free', checked as boolean)}
                    />
                    <label
                      htmlFor="avariiline"
                      className="font-['Poppins',Helvetica] font-normal text-base"
                    >
                      {t('formLabels.accidentFree')}
                    </label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator className="my-2" />

          {/* Fuel Type Section */}
          <Accordion type="single" collapsible>
            <AccordionItem value="fuel-type" className="border-none">
              <AccordionTrigger className="py-2 font-medium text-base font-['Poppins',Helvetica]">
                {t('formLabels.fuelType')}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {fuelTypes.map((type) => (
                    <div key={type.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={type.id}
                        className="w-6 h-6 rounded border-[#ababab]"
                        checked={(filters.fuel_type || []).includes(type.id)}
                        onCheckedChange={(checked) => handleArrayFilter('fuel_type', type.id, checked as boolean)}
                      />
                      <label
                        htmlFor={type.id}
                        className="font-['Poppins',Helvetica] font-normal text-base"
                      >
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator className="my-2" />

          {/* Transmission Type Section */}
          <Accordion type="single" collapsible>
            <AccordionItem value="transmission" className="border-none">
              <AccordionTrigger className="py-2 font-medium text-base font-['Poppins',Helvetica]">
                {t('formLabels.transmissionType')}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {transmissionTypes.map((type) => (
                    <div key={type.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={type.id}
                        className="w-6 h-6 rounded border-[#ababab]"
                        checked={(filters.transmission || []).includes(type.id)}
                        onCheckedChange={(checked) => handleArrayFilter('transmission', type.id, checked as boolean)}
                      />
                      <label
                        htmlFor={type.id}
                        className="font-['Poppins',Helvetica] font-normal text-base"
                      >
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator className="my-2" />

          {/* Technical Indicators */}
          <Accordion type="single" collapsible>
            <AccordionItem value="technical" className="border-none">
              <AccordionTrigger className="py-2 font-medium text-base font-['Poppins',Helvetica]">
                {t('formLabels.technicalSpecs')}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {rangeInputGroups.slice(5).map((group) => (
                    <div key={group.id} className="space-y-2">
                      <label className="block font-['Poppins',Helvetica] font-normal text-[#747474] text-base">
                        {group.label}
                      </label>
                      <div className="flex items-center space-x-2">
                        <Input
                          className="w-[109px] h-[43px] bg-[#f6f7f9] font-['Poppins',Helvetica] text-[#747474]"
                          placeholder="alates"
                          value={filters[group.minKey as keyof CarFilters]?.toString() || ''}
                          onChange={(e) => updateRangeFilter(
                            group.minKey as keyof CarFilters,
                            group.maxKey as keyof CarFilters,
                            e.target.value,
                            filters[group.maxKey as keyof CarFilters]?.toString() || ''
                          )}
                        />
                        <span className="font-['Poppins',Helvetica] font-normal text-base">
                          -
                        </span>
                        <Input
                          className="w-[109px] h-[43px] bg-[#f6f7f9] font-['Poppins',Helvetica] text-[#747474]"
                          placeholder="kuni"
                          value={filters[group.maxKey as keyof CarFilters]?.toString() || ''}
                          onChange={(e) => updateRangeFilter(
                            group.minKey as keyof CarFilters,
                            group.maxKey as keyof CarFilters,
                            filters[group.minKey as keyof CarFilters]?.toString() || '',
                            e.target.value
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator className="my-2" />

          {/* Color Section */}
          <Accordion type="single" collapsible>
            <AccordionItem value="color" className="border-none">
              <AccordionTrigger className="py-2 font-medium text-base font-['Poppins',Helvetica]">
                {t('formLabels.color')}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {colorRows.map((row, rowIndex) => (
                    <div
                      key={`color-row-${rowIndex}`}
                      className="grid grid-cols-2 gap-1"
                    >
                      {row.map((color) => (
                        <label
                          key={color.id}
                          className={`flex items-center space-x-1 cursor-pointer p-1 rounded ${selectedColor === color.id ? 'bg-[#f0fdfa]' : ''}`}
                        >
                          <input
                            type="radio"
                            name="car-color"
                            value={color.id}
                            checked={selectedColor === color.id}
                            onChange={() => {
                              setSelectedColor(color.id);
                              updateFilter('carColor', color.id);
                            }}
                            className="sr-only"
                          />
                          <div
                            className={`w-6 h-6 rounded-full ${color.color} ${color.border || ''} flex items-center justify-center flex-shrink-0 ${selectedColor === color.id ? 'ring-2 ring-blue-500' : ''}`}
                          >
                            {selectedColor === color.id && (
                              <span className="block w-3 h-3 rounded-full bg-white" />
                            )}
                          </div>
                          <span className="font-['Poppins',Helvetica] font-normal text-base leading-tight">
                            {color.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => setShowAllColors(!showAllColors)}
                    className="w-full h-[42px] rounded-[10px] border-[#06d6a0] text-[#06d6a0] font-['Poppins',Helvetica] font-medium"
                  >
                    {showAllColors ? `- ${t('uiActions.showLess')}` : `+ ${t('uiActions.viewMore')}`}
                  </Button>

                  {/* Metallikvärv checkbox */}
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="metallikvärv"
                      className="w-6 h-6 rounded border-[#ababab]"
                      checked={filters.metallic_paint || false}
                      onCheckedChange={(checked) => handleBooleanFilter('metallic_paint', checked as boolean)}
                    />
                    <label
                      htmlFor="metallikvärv"
                      className="font-['Poppins',Helvetica] font-normal text-base"
                    >
                      {t('colors.metallicColor')}
                    </label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator className="my-2" />

          {/* Additional Info Section */}
          <Accordion type="single" collapsible>
            <AccordionItem value="additional-info" className="border-none">
              <AccordionTrigger className="py-2 font-medium text-base font-['Poppins',Helvetica]">
                {t('car.description')}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <Select value={filters.country} onValueChange={(value) => updateFilter('country', value)}>
                    <SelectTrigger className="w-full h-[43px] bg-[#f6f7f9] font-['Poppins',Helvetica] text-[#747474]">
                      <SelectValue placeholder={t('formLabels.country')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Eesti">Eesti</SelectItem>
                      <SelectItem value="Läti">{t('formLabels.latvia')}</SelectItem>
                      <SelectItem value="Leedu">Leedu</SelectItem>
                      <SelectItem value="Soome">Soome</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filters.registered_country} onValueChange={(value) => updateFilter('registered_country', value)}>
                    <SelectTrigger className="w-full h-[43px] bg-[#f6f7f9] font-['Poppins',Helvetica] text-[#747474]">
                      <SelectValue placeholder={t('formLabels.registeredCountry')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Eesti">Eesti</SelectItem>
                      <SelectItem value="Läti">{t('formLabels.latvia')}</SelectItem>
                      <SelectItem value="Leedu">Leedu</SelectItem>
                      <SelectItem value="Soome">Soome</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filters.imported_from} onValueChange={(value) => updateFilter('imported_from', value)}>
                    <SelectTrigger className="w-full h-[43px] bg-[#f6f7f9] font-['Poppins',Helvetica] text-[#747474]">
                      <SelectValue placeholder="Toodud riigist" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Saksamaa">Saksamaa</SelectItem>
                      <SelectItem value="Holland">Holland</SelectItem>
                      <SelectItem value="Belgia">Belgia</SelectItem>
                      <SelectItem value="Prantsusmaa">Prantsusmaa</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filters.seller_type} onValueChange={(value) => updateFilter('seller_type', value)}>
                    <SelectTrigger className="w-full h-[43px] bg-[#f6f7f9] font-['Poppins',Helvetica] text-[#747474]">
                      <SelectValue placeholder={t('formLabels.seller')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="era">Era</SelectItem>
                      <SelectItem value="äri">{t('formLabels.business')}</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="space-y-2 pt-2">
                    {additionalInfo.map((info) => (
                      <div
                        key={info.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={info.id}
                          className="w-6 h-6 rounded border-[#ababab]"
                          checked={filters[info.filterKey as keyof CarFilters] as boolean || false}
                          onCheckedChange={(checked) => handleBooleanFilter(info.filterKey as keyof CarFilters, checked as boolean)}
                        />
                        <label
                          htmlFor={info.id}
                          className="font-['Poppins',Helvetica] font-normal text-base"
                        >
                          {info.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator className="my-2" />

          {/* Equipment Section */}
          <Accordion type="single" collapsible>
            <AccordionItem value="equipment" className="border-none">
              <AccordionTrigger className="py-2 font-medium text-base font-['Poppins',Helvetica]">
                {t('car.features')}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {showAllEquipment ? accessoriesOptions.map((item) => (
                    <div key={item.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={item.key}
                        className="w-6 h-6 rounded border-[#ababab]"
                        checked={(filters.equipment || []).includes(item.key)}
                        onCheckedChange={(checked) => handleArrayFilter('equipment', item.key, checked as boolean)}
                      />
                      <label
                        htmlFor={item.key}
                        className="font-['Poppins',Helvetica] font-normal text-base max-w-[218px]"
                      >
                        {item.label}
                      </label>
                    </div>
                  )) : accessoriesOptions.slice(0, 8).map((item) => (
                    <div key={item.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={item.key}
                        className="w-6 h-6 rounded border-[#ababab]"
                        checked={(filters.equipment || []).includes(item.key)}
                        onCheckedChange={(checked) => handleArrayFilter('equipment', item.key, checked as boolean)}
                      />
                      <label
                        htmlFor={item.key}
                        className="font-['Poppins',Helvetica] font-normal text-base max-w-[218px]"
                      >
                        {item.label}
                      </label>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => setShowAllEquipment(!showAllEquipment)}
                    className="w-full h-[42px] rounded-[10px] border-[#06d6a0] text-[#06d6a0] font-['Poppins',Helvetica] font-medium"
                  >
                    {showAllEquipment ? `- ${t('uiActions.showLess')}` : `+ ${t('uiActions.viewMore')}`}
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator className="my-2" />

          {/* Apply Filters Button */}
          <div className={`space-y-2 ${isMobile ? 'sticky bottom-0 bg-white ' : ''}`}>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/${currentLang}/search`);
                window.scrollTo(0, 0);
              }}
              className="w-full h-[43px] bg-[#06d6a0] text-white font-['Poppins',Helvetica] font-medium rounded-[10px]"
            >
              {t('search.applyFilters')}
            </Button>
            <Button
              variant="outline"
              onClick={() => onFiltersChange({})}
              className="w-full h-[43px] border-[#06d6a0] text-[#06d6a0] font-['Poppins',Helvetica] font-medium rounded-[10px]"
            >
              {t('search.clearFilters')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

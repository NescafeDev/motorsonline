import React, { useState, useEffect } from "react";
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

// Import CarFilters from HomePage
export interface CarFilters {
  brand_id?: number;
  model_id?: number;
  model_name?: string;
  trim_level?: string;
  drive_type_id?: number[];
  seats?: number;
  doors?: number;
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
}

interface CarListingSectionProps {
  filters: CarFilters;
  onFiltersChange: (filters: CarFilters) => void;
  onApplyFilters: () => void;
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
  onApplyFilters
}: CarListingSectionProps): JSX.Element => {
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
        setDriveTypes(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching drive types:', error);
        setDriveTypes([]);
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
        setBrands(Array.isArray(response.data) ? response.data : []);
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
        setModels(Array.isArray(response.data) ? response.data : []);
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
    if (filters.brand_id && Array.isArray(models)) {
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
    { id: "bensiin", label: "Bensiin" },
    { id: "diisel", label: "Diisel" },
    { id: "elektriline", label: "Elektriline" },
    { id: "hubriid-ben-el", label: "Hübriid (ben./el.)" },
    { id: "hubriid-dii-el", label: "Hübriid (dii./el.)" },
    { id: "pistikhuubriid-ben-el", label: "Pistikhübriid (ben./el.)" },
    { id: "pistikhuubriid-dii-el", label: "Pistikhübriid (dii./el.)" },
    { id: "bensiin-lpg", label: "Bensiin + LPG" },
    { id: "bensiin-cng", label: "Bensiin + CNG" },
    { id: "bensiin-lng", label: "Bensiin + LNG" },
    { id: "diisel-cng", label: "Diisel + CNG" },
    { id: "diisel-lng", label: "Diisel + LNG" },
    { id: "lpg", label: "LPG (vedelgaas)" },
    { id: "cng", label: "CNG (surugaas)" },
    { id: "lng", label: "LNG (veeldatud maagaas)" },
    { id: "vesinik", label: "Vesinik" },
    { id: "etanool", label: "Etanool" },
  ];

  // Data for transmission types
  const transmissionTypes = [
    { id: "manuaal", label: "Manuaal" },
    { id: "automaat", label: "Automaat" },
    { id: "poolautomaat", label: "Poolautomaat" },
  ];

  // Data for colors
  const colorRows = [
    [
      { id: "valge", label: "Valge", color: "bg-white" },
      { id: "must", label: "Must", color: "bg-[#000000]" },
    ],
    [
      { id: "sinine", label: "Sinine", color: "bg-[#0065ff]" },
      { id: "roosa", label: "Roosa", color: "bg-[#fe5bee]" },
    ],
    [
      { id: "punane", label: "Punane", color: "bg-[#ff0000]" },
      { id: "pruun", label: "Pruun", color: "bg-[#946454]" },
    ],
  ];

  // Data for additional info
  const additionalInfo = [
    { id: "metallikvärv", label: "Metallikvärv", filterKey: "metallic_paint" },
    { id: "vahetuse-voimalus", label: "Vahetuse võimalus", filterKey: "exchange_possible" },
    { id: "garantiiga", label: "Garantiiga", filterKey: "with_warranty" },
  ];

  // Data for equipment
  const equipment = [
    {
      id: "elektriliselt-reguleeritavad-istmed",
      label: "Elektriliselt reguleeritavad istmed",
    },
    { id: "istmesoojendused", label: "Istmesoojendused" },
    { id: "ventileeritavad-istmed", label: "Ventileeritavad istmed" },
    { id: "isofix-kinnituspunktid", label: "Isofix-kinnituspunktid" },
    { id: "pusikiirusehoidja", label: "Püsikiirusehoidja" },
    { id: "votmeta-sisenemine", label: "Võtmeta sisenemine" },
    {
      id: "head-up-display",
      label: "Info kuvamine esiklaasile (head-up display)",
    },
    { id: "parkimisandurid", label: "Parkimisandurid" },
    { id: "carplay-android", label: "Apple CarPlay / Android Auto" },
    { id: "start-stop", label: "Start/stop süsteem" },
    { id: "veokonks", label: "Veokonks" },
  ];

  // Range input groups
  const rangeInputGroups = [
    { id: "price", label: "Hind", minKey: "price_min", maxKey: "price_max" },
    { id: "year", label: "Aasta", minKey: "year_min", maxKey: "year_max" },
    { id: "mileage", label: "Läbisõit (km)", minKey: "mileage_min", maxKey: "mileage_max" },
    { id: "power", label: "Võimsus (kw)", minKey: "power_min", maxKey: "power_max" },
    { id: "engine", label: "Mootorimaht (cm3)", minKey: "engine_min", maxKey: "engine_max" },
    { id: "fuel-city", label: "Kütusekulu linnas (100km)", minKey: "fuel_city_min", maxKey: "fuel_city_max" },
    { id: "fuel-highway", label: "Kütusekulu maanteel (100km)", minKey: "fuel_highway_min", maxKey: "fuel_highway_max" },
    { id: "fuel-average", label: "Kütusekulu keskmine (100km)", minKey: "fuel_average_min", maxKey: "fuel_average_max" },
    { id: "co2", label: "CO2 (100km)", minKey: "co2_min", maxKey: "co2_max" },
  ];

  const [selectedColor, setSelectedColor] = useState<string | null>(filters.color || null);

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
  const updateRangeFilter = (minKey: keyof CarFilters, maxKey: keyof CarFilters, minValue: string, maxValue: string) => {
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
    <div className="w-full max-w-[292px]">
      <Card className="rounded-[10px]">
        <CardContent className="p-5 space-y-4">
          <h2 className="font-medium text-xl font-['Poppins',Helvetica]">
            Filtrid
          </h2>

          {/* Make and Model Selectors */}
          <div className="space-y-3">
            {brandsLoading ? (
              <div className="h-[43px] bg-[#f6f7f9] flex items-center justify-center text-[#747474]">
                Laetakse marke...
              </div>
            ) : (
              <Combobox
                className="font-normal"
                options={(brands || []).map(brand => ({ value: brand.id.toString(), label: brand.name }))}
                value={filters.brand_id?.toString() || ""}
                onValueChange={handleBrandChange}
                placeholder="Mark"
                searchPlaceholder="Otsi marki..."
                emptyMessage="Marki ei leitud"
              />
            )}

            {modelsLoading ? (
              <div className="h-[43px] bg-[#f6f7f9] flex items-center justify-center text-[#747474]">
                Laetakse mudelid...
              </div>
            ) : (
              <Combobox
                className="font-normal"
                options={(filteredModels || []).map(model => ({ value: model.id.toString(), label: model.name }))}
                value={filters.model_id?.toString() || ""}
                onValueChange={(value) => {
                  if (value === "") {
                    updateFilter('model_id', undefined);
                  } else {
                    updateFilter('model_id', Number(value));
                  }
                }}
                placeholder="Mudelid"
                searchPlaceholder="Otsi mudelit..."
                emptyMessage="Mudelit ei leitud"
                disabled={filters.brand_id === undefined || filters.brand_id === null}
              />
            )}

            <Input
              className="h-[43px] bg-[#f6f7f9] font-['Poppins',Helvetica] text-[#747474] border-none"
              placeholder="Mudeli nimi"
              value={filters.model_name || ''}
              onChange={(e) => updateFilter('model_name', e.target.value)}
            />

            <Input
              className="h-[43px] bg-[#f6f7f9] font-['Poppins',Helvetica] text-[#747474] border-none"
              placeholder="Varustustase/versioon"
              value={filters.trim_level || ''}
              onChange={(e) => updateFilter('trim_level', e.target.value)}
            />
          </div>

          <Separator className="my-2" />

          {/* Drive Type Section */}
          <Accordion type="single" collapsible defaultValue="drive-type">
            <AccordionItem value="drive-type" className="border-none">
              <AccordionTrigger className="py-2 font-medium text-base font-['Poppins',Helvetica]">
                Keretüüp
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {(driveTypes || []).map((type) => (
                    <div key={type.id} className="flex items-center space-x-2">
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
                        {type.ee_name}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator className="my-2" />

          {/* Seats Section */}
          <Select value={filters.seats?.toString()} onValueChange={(value) => updateFilter('seats', Number(value))}>
            <SelectTrigger className="w-full h-[43px] bg-[#f6f7f9] font-['Poppins',Helvetica] text-[#747474]">
              <SelectValue placeholder="Istekohti" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="7">7</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.doors?.toString()} onValueChange={(value) => updateFilter('doors', Number(value))}>
            <SelectTrigger className="w-full h-[43px] bg-[#f6f7f9] font-['Poppins',Helvetica] text-[#747474]">
              <SelectValue placeholder="Uste arv" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5</SelectItem>
            </SelectContent>
          </Select>

          {/* Range Input Groups */}
          {(rangeInputGroups || []).slice(0, 3).map((group) => (
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

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
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
                Käibemaksuga
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
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
                Hooldusraamat
              </label>
            </div>
            <div className="flex items-center space-x-2">
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
                Ülevaatus
              </label>
            </div>
            <div className="flex items-center space-x-2">
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
                Avariiline
              </label>
            </div>
          </div>

          <Separator className="my-2" />

          {/* Fuel Type Section */}
          <Accordion type="single" collapsible defaultValue="fuel-type">
            <AccordionItem value="fuel-type" className="border-none">
              <AccordionTrigger className="py-2 font-medium text-base font-['Poppins',Helvetica]">
                Kütus
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {(fuelTypes || []).map((type) => (
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

          {/* Technical Specifications */}
          {(rangeInputGroups || []).slice(3, 5).map((group) => (
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

          <Separator className="my-2" />

          {/* Transmission Type Section */}
          <Accordion type="single" collapsible defaultValue="transmission">
            <AccordionItem value="transmission" className="border-none">
              <AccordionTrigger className="py-2 font-medium text-base font-['Poppins',Helvetica]">
                Käigukast
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {(transmissionTypes || []).map((type) => (
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
          <Accordion type="single" collapsible defaultValue="technical">
            <AccordionItem value="technical" className="border-none">
              <AccordionTrigger className="py-2 font-medium text-base font-['Poppins',Helvetica]">
                Tehnilised näitajad
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {(rangeInputGroups || []).slice(5).map((group) => (
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
          <Accordion type="single" collapsible defaultValue="color">
            <AccordionItem value="color" className="border-none">
              <AccordionTrigger className="py-2 font-medium text-base font-['Poppins',Helvetica]">
                Värv
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {(colorRows || []).map((row, rowIndex) => (
                    <div
                      key={`color-row-${rowIndex}`}
                      className="flex justify-between row"
                    >
                      {(row || []).map((color) => (
                        <label
                          key={color.id}
                          className={`flex items-center space-x-2 col-6 w-full cursor-pointer ${selectedColor === color.id ? 'bg-[#f0fdfa]' : ''}`}
                        >
                          <input
                            type="radio"
                            name="car-color"
                            value={color.id}
                            checked={selectedColor === color.id}
                            onChange={() => {
                              setSelectedColor(color.id);
                              updateFilter('color', color.id);
                            }}
                            className="sr-only"
                          />
                          <div
                            className={`w-6 h-6 rounded-full ${color.color} flex items-center justify-center ${selectedColor === color.id ? '' : ''}`}
                          >
                            {selectedColor === color.id && (
                              <span className="block w-3 h-3 rounded-full bg-white" />
                            )}
                          </div>
                          <span className="font-['Poppins',Helvetica] font-normal text-base">
                            {color.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full h-[42px] rounded-[10px] border-[#06d6a0] text-[#06d6a0] font-['Poppins',Helvetica] font-medium"
                  >
                    + Vaata rohkem
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator className="my-2" />

          {/* Additional Info Section */}
          <Accordion type="single" collapsible defaultValue="additional-info">
            <AccordionItem value="additional-info" className="border-none">
              <AccordionTrigger className="py-2 font-medium text-base font-['Poppins',Helvetica]">
                Lisainfo
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <Select value={filters.country} onValueChange={(value) => updateFilter('country', value)}>
                    <SelectTrigger className="w-full h-[43px] bg-[#f6f7f9] font-['Poppins',Helvetica] text-[#747474]">
                      <SelectValue placeholder="Riik" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Eesti">Eesti</SelectItem>
                      <SelectItem value="Läti">Läti</SelectItem>
                      <SelectItem value="Leedu">Leedu</SelectItem>
                      <SelectItem value="Soome">Soome</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filters.registered_country} onValueChange={(value) => updateFilter('registered_country', value)}>
                    <SelectTrigger className="w-full h-[43px] bg-[#f6f7f9] font-['Poppins',Helvetica] text-[#747474]">
                      <SelectValue placeholder="Arvel riigis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Eesti">Eesti</SelectItem>
                      <SelectItem value="Läti">Läti</SelectItem>
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
                      <SelectValue placeholder="Müüja" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="era">Era</SelectItem>
                      <SelectItem value="äri">Äri</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="space-y-2 pt-2">
                    {(additionalInfo || []).map((info) => (
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
          <Accordion type="single" collapsible defaultValue="equipment">
            <AccordionItem value="equipment" className="border-none">
              <AccordionTrigger className="py-2 font-medium text-base font-['Poppins',Helvetica]">
                Lisavarustus
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {(equipment || []).map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={item.id}
                        className="w-6 h-6 rounded border-[#ababab]"
                        checked={(filters.equipment || []).includes(item.id)}
                        onCheckedChange={(checked) => handleArrayFilter('equipment', item.id, checked as boolean)}
                      />
                      <label
                        htmlFor={item.id}
                        className="font-['Poppins',Helvetica] font-normal text-base max-w-[218px]"
                      >
                        {item.label}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator className="my-2" />

          {/* Apply Filters Button */}
          <div className="space-y-2">
            <Button
              onClick={onApplyFilters}
              className="w-full h-[43px] bg-[#06d6a0] text-white font-['Poppins',Helvetica] font-medium rounded-[10px]"
            >
              Rakenda filtrid
            </Button>
            <Button
              variant="outline"
              onClick={() => onFiltersChange({})}
              className="w-full h-[43px] border-[#06d6a0] text-[#06d6a0] font-['Poppins',Helvetica] font-medium rounded-[10px]"
            >
              Tühjenda filtrid
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

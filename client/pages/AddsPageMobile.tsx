import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "@/components/mobile/Header";
import Footer from "@/components/mobile/Footer";
import PhotoUpload from "@/components/PhotoUpload";
import FormSection, {
  FormField,
  TextAreaField,
  CheckboxField,
} from "@/components/FormSection";
import ReactFlagsSelect from "react-flags-select";
const ChevronDownIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.5002 11.6997C8.03353 11.6997 7.56686 11.5197 7.21353 11.1664L2.86686 6.81968C2.67353 6.62635 2.67353 6.30635 2.86686 6.11302C3.0602 5.91968 3.3802 5.91968 3.57353 6.11302L7.9202 10.4597C8.2402 10.7797 8.7602 10.7797 9.0802 10.4597L13.4269 6.11302C13.6202 5.91968 13.9402 5.91968 14.1335 6.11302C14.3269 6.30635 14.3269 6.62635 14.1335 6.81968L9.78686 11.1664C9.43353 11.5197 8.96686 11.6997 8.5002 11.6997Z"
      fill="#06D6A0"
      stroke="#06D6A0"
      strokeWidth="0.5"
    />
  </svg>
);

const techCheckOptions = [
  { key: 'technicalInspection', label: 'Teostatud tehniline kontroll' },
  { key: 'technicalMaintenance', label: 'Teostatud tehniline hooldus' },
  { key: 'serviceBook', label: 'Hooldusraamat' },
  { key: 'hideVin', label: 'Peida VIN-kood' },
];

const accessoriesOptions = [
  { key: 'abs', label: 'ABS' },
  { key: 'adaptiveHeadlights', label: 'Adaptiivne kurvituli' },
  { key: 'alarmSystem', label: 'Häiresüsteem' },
  { key: 'ambientLighting', label: 'Ambiente valgustus' },
  { key: 'appleCarplay', label: 'Apple Carplay' },
  { key: 'armrest', label: 'Käetugi' },
  { key: 'hillStartAssist', label: 'Käivitusabi mäkketõusul' },
  { key: 'automaticHighBeams', label: 'Pimestamisvaba kaugtuli' },
  { key: 'bluetooth', label: 'Bluetooth' },
  { key: 'boardComputer', label: 'Bordcomputer (pardaarvuti)' },
  { key: 'cdPlayer', label: 'CD-mängija' },
  { key: 'electricWindows', label: 'Elektrilised aknatõstukid' },
];

export default function AddsPageMobile() {
  const navigate = useNavigate();
  const { id: carId } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCar, setEditingCar] = useState<any | null>(null);
  
  const [formData, setFormData] = useState({
    brand_id: "",
    model_id: "",
    year_id: "",
    drive_type_id: "",
    category: "",
    transmission: "",
    fuelType: "",
    plateNumber: "",
    vehicleType: "",
    bodyType: "",
    month: "",
    mileage: "",
    power: "",
    displacement: "",
    technicalData: "",
    ownerCount: "",
    modelDetail: "",
    price: "",
    discountPrice: "",
    warranty: "",
    vatRefundable: "",
    vatRate: "24",
    accident: "",
    vinCode: "",
    description: "",
    equipment: "",
    additionalInfo: "",
    country: "EE",
    phone: "",
    businessType: "",
    socialNetwork: "",
    email: "",
  });

  const [checktechboxes, setCheckTechboxes] = useState({
    technicalInspection: false,
    technicalMaintenance: false,
    serviceBook: false,
    hideVin: false,
  });

  const [checkboxes, setCheckboxes] = useState({
    abs: false,
    adaptiveHeadlights: false,
    alarmSystem: false,
    ambientLighting: false,
    appleCarplay: false,
    armrest: false,
    hillStartAssist: false,
    automaticHighBeams: false,
    bluetooth: false,
    boardComputer: false,
    cdPlayer: false,
    electricWindows: false,
  });

  const [showMoreEquipment, setShowMoreEquipment] = useState(false);
  const [showMorePhotos, setShowMorePhotos] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [carImages, setCarImages] = useState<(File | null)[]>(Array(40).fill(null));
  
  // Data for dropdowns
  const [brands, setBrands] = useState<{ id: number; name: string }[]>([]);
  const [models, setModels] = useState<{ id: number; name: string }[]>([]);
  const [years, setYears] = useState<{ id: number; value: string }[]>([]);
  const [driveTypes, setDriveTypes] = useState<{ id: number; name: string; ee_name: string }[]>([]);

  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([
        fetchBrands(),
        fetchYears(),
        fetchDriveTypes()
      ]);
      
      // If we have a carId in the URL, fetch that car for editing
      if (carId) {
        const car = await fetchCarById(carId);
        if (car) {
          // Set the car data after all other data is loaded
          setEditingCar(car);
          
          // Convert car data to proper format for form fields
          let priceToShow = car.price?.toString() || "";
          
          // If car has VAT applied, calculate the base price for editing
          if (car.vatRefundable === 'yes' && car.price && car.vatRate) {
            const totalPrice = parseFloat(car.price.toString());
            const vatRate = 24;
            if (!isNaN(totalPrice) && !isNaN(vatRate)) {
              const basePrice = calculateBasePriceFromTotal(totalPrice, vatRate);
              priceToShow = basePrice.toString();
            }
          }
          
          const formattedCarData = {
            ...car,
            brand_id: car.brand_id?.toString() || "",
            model_id: car.model_id?.toString() || "",
            year_id: car.year_id?.toString() || "",
            drive_type_id: car.drive_type_id?.toString() || "",
            price: priceToShow,
            discountPrice: car.discountPrice?.toString() || "",
            mileage: car.mileage?.toString() || "",
            power: car.power?.toString() || "",
            displacement: car.displacement?.toString() || "",
            ownerCount: car.ownerCount?.toString() || "",
            vatRate: car.vatRate?.toString() || "",
            month: car.month?.toString() || "",
          };
          
          setFormData((prev) => ({
            ...prev,
            ...formattedCarData,
          }));
          
          // Fetch models for the selected brand when editing
          if (car.brand_id) {
            await fetchModels(car.brand_id.toString());
          }
          
          // Set checkboxes
          if (car.tech_check) {
            const arr = Array.isArray(car.tech_check) ? car.tech_check : car.tech_check.split(',');
            setCheckTechboxes((prev) => {
              const obj: any = {};
              techCheckOptions.forEach(opt => {
                obj[opt.key] = arr.includes(opt.key);
              });
              return obj;
            });
          }
          if (car.accessories) {
            const arr = Array.isArray(car.accessories) ? car.accessories : car.accessories.split(',');
            setCheckboxes((prev) => {
              const obj: any = {};
              accessoriesOptions.forEach(opt => {
                obj[opt.key] = arr.includes(opt.key);
              });
              return obj;
            });
          }
        } else {
          // If car not found, redirect to user page
          navigate('/user');
        }
      } else {
        // Check for editing car data in localStorage (fallback for old approach)
        const editingCarData = localStorage.getItem('editingCar');
        if (editingCarData) {
          try {
            const car = JSON.parse(editingCarData);
            handleEditCar(car);
            // Clear the localStorage after loading the data
            localStorage.removeItem('editingCar');
          } catch (error) {
            console.error('Error parsing editing car data:', error);
            localStorage.removeItem('editingCar');
          }
        }
      }
    };
    
    initializeData().finally(() => {
      setIsLoading(false);
    });
  }, [carId]);

  // Auto-select first option for selects on add (not edit)
  useEffect(() => {
    if (!editingCar) {
      // Set brand_id
      if (brands.length > 0 && !formData.brand_id) {
        setFormData((prev) => ({ ...prev, brand_id: brands[0].id.toString() }));
      }
      // Set model_id
      if (models.length > 0 && !formData.model_id) {
        setFormData((prev) => ({ ...prev, model_id: models[0].id.toString() }));
      }
      // Set year_id to 2025 by default
      if (years.length > 0 && !formData.year_id) {
        const year2025 = years.find(y => y.value === "2025");
        if (year2025) {
          setFormData((prev) => ({ ...prev, year_id: year2025.id.toString() }));
        } else {
          // Fallback to first year if 2025 not found
          setFormData((prev) => ({ ...prev, year_id: years[0].id.toString() }));
        }
      }
      // Set vatRefundable
      if (!formData.vatRefundable) {
        setFormData((prev) => ({ ...prev, vatRefundable: "yes" }));
      }
      // Set vatRate
      if (!formData.vatRate) {
        setFormData((prev) => ({ ...prev, vatRate: "24" }));
      }
      // Set ownerCount
      if (!formData.ownerCount) {
        setFormData((prev) => ({ ...prev, ownerCount: "1" }));
      }
      // Set drive_type_id
      if (driveTypes.length > 0 && !formData.drive_type_id) {
        setFormData((prev) => ({ ...prev, drive_type_id: driveTypes[0].id.toString() }));
      }
      // Set transmission
      if (!formData.transmission) {
        setFormData((prev) => ({ ...prev, transmission: "helical" }));
      }
      // Set fuelType
      if (!formData.fuelType) {
        setFormData((prev) => ({ ...prev, fuelType: "petrol" }));
      }
      // Set vehicleType
      if (!formData.vehicleType) {
          setFormData((prev) => ({ ...prev, vehicleType: "sõiduauto" }));
        }
      // Set category
      if (!formData.category) {
        setFormData((prev) => ({ ...prev, category: "sedaan" }));
      }
    }
  }, [brands, models, years, driveTypes, editingCar]);

  useEffect(() => {
    if (formData.brand_id) {
      fetchModels(formData.brand_id);
    } else {
      setModels([]);
      setFormData((prev) => ({ ...prev, model_id: "" }));
    }
  }, [formData.brand_id]);

  const fetchModels = async (brand_id: string) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`/api/models?brand_id=${brand_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setModels(res.data);
  };

  const fetchCarById = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`/api/cars/edit/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      console.error('Error fetching car:', error);
      return null;
    }
  };

  const fetchBrands = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("/api/brands", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setBrands(res.data);
  };

  const fetchYears = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("/api/years", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setYears(res.data);
  };

  const fetchDriveTypes = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("/api/drive-types", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setDriveTypes(res.data);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setCheckboxes((prev) => ({ ...prev, [field]: checked }));
  };

  const handleCheckTechboxChange = (field: string, checked: boolean) => {
    setCheckTechboxes((prev) => ({ ...prev, [field]: checked }));
  };

  const handleCarImageChange = (index: number, file: File | null) => {
    setCarImages((prev) => {
      const updated = [...prev];
      updated[index] = file;
      return updated;
    });
  };

  const handleImageReorder = (sourceIndex: number, destinationIndex: number) => {
    setCarImages((prev) => {
      const updated = [...prev];
      const [movedItem] = updated.splice(sourceIndex, 1);
      updated.splice(destinationIndex, 0, movedItem);
      return updated;
    });
  };

  // Calculate VAT price for display
  const calculateVatPrice = () => {
    if (formData.vatRefundable === 'yes' && formData.price && formData.vatRate) {
      const basePrice = parseFloat(formData.price);
      const vatRate = 24;
      
      if (!isNaN(basePrice) && !isNaN(vatRate)) {
        const vatAmount = basePrice * (vatRate / 100);
        const totalPrice = basePrice + vatAmount;
        return {
          basePrice,
          vatAmount,
          totalPrice
        };
      }
    }
    return null;
  };

  // Calculate base price from total price (for editing cars with VAT)
  const calculateBasePriceFromTotal = (totalPrice: number, vatRate: number) => {
    if (vatRate > 0) {
      return (totalPrice / (1 + vatRate / 100)).toFixed(1);
    }
    return totalPrice;
  };

  const handleEditCar = (car: any) => {
    setEditingCar(car);
    
    // Calculate base price if VAT is applied
    let priceToShow = car.price?.toString() || "";
    if (car.vatRefundable === 'yes' && car.price && car.vatRate) {
      const totalPrice = parseFloat(car.price.toString());
      const vatRate = 24;

      if (!isNaN(totalPrice) && !isNaN(vatRate)) {
        const basePrice = calculateBasePriceFromTotal(totalPrice, vatRate);
        priceToShow = basePrice.toString();
      }
    }
    
    setFormData((prev) => ({
      ...prev,
      ...car,
      price: priceToShow,
    }));
    setCarImages(Array(40).fill(null));
    setShowMorePhotos(false);
    
    // Fetch models for the selected brand when editing
    if (car.brand_id) {
      fetchModels(car.brand_id.toString());
    }
    
    if (car.tech_check) {
      const arr = Array.isArray(car.tech_check) ? car.tech_check : car.tech_check.split(',');
      setCheckTechboxes((prev) => {
        const obj: any = {};
        techCheckOptions.forEach(opt => {
          obj[opt.key] = arr.includes(opt.key);
        });
        return obj;
      });
    }
    if (car.accessories) {
      const arr = Array.isArray(car.accessories) ? car.accessories : car.accessories.split(',');
      setCheckboxes((prev) => {
        const obj: any = {};
        accessoriesOptions.forEach(opt => {
          obj[opt.key] = arr.includes(opt.key);
        });
        return obj;
      });
    }
  };

  const handleCarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Validate required fields
      const requiredFields = ['brand_id', 'model_id', 'year_id', 'price', 'phone', 'email'];
      const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      // Check if at least one image is uploaded (only for new cars)
      if (!editingCar && !carImages.some(img => img !== null)) {
        throw new Error('Please upload at least one image');
      }

      // Prepare form data
      const formDataObj = new FormData();
      
      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataObj.append(key, value as string);
      });

      // Add images
      carImages.forEach((file, idx) => {
        if (file) formDataObj.append(`image_${idx + 1}`, file);
      });

      // Add checkboxes
      const techCheckSelected = Object.entries(checktechboxes)
        .filter(([k, v]) => v)
        .map(([k]) => k);
      
      const accessoriesSelected = Object.entries(checkboxes)
        .filter(([k, v]) => v)
        .map(([k]) => k);

      formDataObj.append('tech_check', techCheckSelected.join(','));
      formDataObj.append('accessories', accessoriesSelected.join(','));

      // Get auth token
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error('Please log in to create a car listing');
      }

      // Submit to server
      if (editingCar) {
        await axios.put(`/api/cars/${editingCar.id}`, formDataObj, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        });
      } else {
        await axios.post("/api/cars", formDataObj, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        });
      }

      console.log('Car saved successfully');
      
      // Reset form and redirect
      setEditingCar(null);
      setFormData({
        brand_id: "",
        model_id: "",
        year_id: "",
        drive_type_id: "",
        category: "",
        transmission: "",
        fuelType: "",
        plateNumber: "",
        vehicleType: "",
        bodyType: "",
        month: "",
        mileage: "",
        power: "",
        displacement: "",
        technicalData: "",
        ownerCount: "",
        modelDetail: "",
        price: "",
        discountPrice: "",
        warranty: "",
        vatRefundable: "",
        vatRate: "24",
        accident: "",
        vinCode: "",
        description: "",
        equipment: "",
        additionalInfo: "",
        country: "EE",
        phone: "",
        businessType: "",
        socialNetwork: "",
        email: "",
      });
      setCheckTechboxes({
        technicalInspection: false,
        technicalMaintenance: false,
        serviceBook: false,
        hideVin: false,
      });
      setCheckboxes({
        abs: false,
        adaptiveHeadlights: false,
        alarmSystem: false,
        ambientLighting: false,
        appleCarplay: false,
        armrest: false,
        hillStartAssist: false,
        automaticHighBeams: false,
        bluetooth: false,
        boardComputer: false,
        cdPlayer: false,
        electricWindows: false,
      });
      setCarImages(Array(40).fill(null));
      setShowMorePhotos(false);
      
      // Navigate to user's listings
      navigate("/user");
      
    } catch (error: any) {
      console.error('Error saving car:', error);
      setSubmitError(error.response?.data?.message || error.message || 'An error occurred while saving the car listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-motorsoline-text text-3xl font-semibold mb-8">
              Laetakse...
            </h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-motorsoline-text text-3xl font-semibold mb-8">
          {editingCar ? 'Redigeeri kuulutus' : 'Loo kuulutus'}
        </h1>

        {/* Error message */}
        {submitError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{submitError}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Photo Upload Section */}
          <FormSection title="">
            <PhotoUpload
              images={carImages}
              onImageChange={handleCarImageChange}
              onReorder={handleImageReorder}
              previews={
                editingCar
                  ? Array.from({ length: 40 }, (_, i) => editingCar[`image_${i + 1}`])
                  : []
              }
              maxPhotos={40}
              initialVisibleCount={8}
              showMore={showMorePhotos}
              onToggleShowMore={() => setShowMorePhotos(!showMorePhotos)}
            />
          </FormSection>

          {/* Vehicle Details */}
          <FormSection title="Mudelidetailid">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FormField
                label="Valige sõiduki liik"
                placeholder="Valik sõiduki liik"
                isSelect
                value={formData.vehicleType}
                onChange={(value) => handleInputChange("vehicleType", value)}
                options={[
                  {
                    value: "sõiduauto",
                    label: "Sõiduauto",
                  },
                  {
                    value: "maastur",
                    label: "Maastur",
                  },
                  {
                    value: "kaubik",
                    label: "Kaubik",
                  },
                  {
                    value: "buss",
                    label: "Buss",
                  },
                  {
                    value: "veoauto",
                    label: "Veoauto",
                  },
                  {
                    value: "haagis",
                    label: "Haagis",
                  },
                  {
                    value: "mototehnika",
                    label: "Mototehnika",
                  },
                  {
                    value: "haagissuvila",
                    label: "Haagissuvila",
                  },
                  {
                    value: "autoelamu",
                    label: "Autoelamu",
                  },
                  {
                    value: "veesõiduk",
                    label: "Veesõiduk",
                  },
                  {
                    value: "ehitustehnika",
                    label: "Ehitustehnika",
                  },
                  {
                    value: "põllumajandustehnika",
                    label: "Põllumajandustehnika",
                  },
                  {
                    value: "metsatehnika",
                    label: "Metsatehnika",
                  },
                  {
                    value: "kommunaaltehnika",
                    label: "Kommunaaltehnika",
                  },
                  {
                    value: "võistlussõiduk",
                    label: "Võistlussõiduk",
                  },
                  {
                    value: "muu",
                    label: "Muu",
                  },
                ]}
              />
              <FormField
                label="Keretüüp"
                placeholder="Keretüüp"
                isSelect
                value={formData.bodyType}
                onChange={(value) => handleInputChange("bodyType", value)}
                options={[
                  {
                    value: "sedaan",
                    label: "sedaan",
                  },
                  {
                    value: "luukpara",
                    label: "luukpara",
                  },
                  {
                    value: "universaal",
                    label: "universaal",
                  },
                  {
                    value: "mahtuniversaal",
                    label: "mahtuniversaal",
                  },
                  {
                    value: "kupee",
                    label: "kupee",
                  },
                  {
                    value: "kabriolett",
                    label: "kabriolett",
                  },
                  {
                    value: "pikap",
                    label: "pikap",
                  },
                  {
                    value: "limusiin",
                    label: "limusiin",
                  },
                ]}
              />
              <FormField
                label="Valik mark"
                placeholder="Valik mark"
                isSelect
                value={formData.brand_id || ""}
                onChange={(value) => handleInputChange("brand_id", value)}
                options={brands.map((b) => ({ value: b.id, label: b.name }))}
              />
              <FormField
                label="Mudel"
                placeholder="Valik mudel"
                isSelect
                value={formData.model_id || ""}
                onChange={(value) => handleInputChange("model_id", value)}
                options={models.map((m) => ({ value: m.id, label: m.name }))}
                className={formData.brand_id ? "" : "hidden"}
              />
              <FormField
                label="Esmane registreerimine"
                placeholder="2025"
                isSelect
                value={formData.year_id || ""}
                onChange={(value) => handleInputChange("year_id", value)}
                options={years.map((y) => ({ value: y.id, label: y.value }))}
              />
              <div className="space-y-1">
                <label className="block text-motorsoline-text text-lg font-medium">
                  &nbsp;
                </label>
                <select
                  value={formData.month}
                  onChange={(e) => handleInputChange("month", e.target.value)}
                  className="w-full h-14 px-5 rounded-lg border border-motorsoline-form-border bg-white text-lg text-motorsoline-placeholder appearance-none focus:outline-none focus:ring-2 focus:ring-motorsoline-primary focus:border-transparent"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </select>
              </div>
              <FormField
                label="Läbisõit"
                placeholder="Läbisõit"
                suffix="km"
                value={formData.mileage}
                onChange={(value) => handleInputChange("mileage", value)}
              />
              <FormField
                label="Võimsus"
                placeholder="0"
                suffix="kw"
                value={formData.power}
                onChange={(value) => handleInputChange("power", value)}
              />
              <FormField
                label="Muu mudel või täpsustus"
                placeholder="näide: Long 4Matic"
                value={formData.modelDetail}
                onChange={(value) => handleInputChange("modelDetail", value)}
              />
              <div className="space-y-2">
                <FormField
                  label="Hind"
                  placeholder="€"
                  value={formData.price}
                  onChange={(value) => handleInputChange("price", value)}
                />
                {(() => {
                  const vatCalculation = calculateVatPrice();
                  if (vatCalculation) {
                    return (
                      <p className="text-sm text-gray-600">
                        {editingCar ? (
                          <>
                            Baashind: €{vatCalculation.basePrice.toLocaleString()} + 
                            KM (24%): €{vatCalculation.vatAmount.toLocaleString()} = 
                            <span className="font-semibold text-motorsoline-primary"> €{vatCalculation.totalPrice.toLocaleString()}</span>
                            <br />
                            <span className="text-xs text-blue-600">(Salvestatud hind: €{editingCar.price?.toLocaleString()})</span>
                          </>
                        ) : (
                          <>
                            Baashind: €{vatCalculation.basePrice.toLocaleString()} + 
                            KM (24%): €{vatCalculation.vatAmount.toLocaleString()} = 
                            <span className="font-semibold text-motorsoline-primary"> €{vatCalculation.totalPrice.toLocaleString()}</span>
                          </>
                        )}
                      </p>
                    );
                  }
                  return null;
                })()}
              </div>
              <FormField
                label="Soodushind"
                placeholder="€"
                value={formData.discountPrice}
                onChange={(value) => handleInputChange("discountPrice", value)}
              />
              <FormField
                label="Garantii"
                placeholder="Kehtib kuni"
                value={formData.warranty}
                onChange={(value) => handleInputChange("warranty", value)}
              />
              <FormField
                label="Käibemaksu tagastatavus"
                placeholder="Yes"
                isSelect
                value={formData.vatRefundable}
                onChange={(value) => handleInputChange("vatRefundable", value)}
                options={[
                  {
                    value: "jah",
                    label: "JAH",
                  },
                  {
                    value: "ei",
                    label: "EI",
                  },
                ]}
              />
              <FormField
                label="Käibemaksumäär"
                placeholder="Sisesta protsent 0-30"
                type="number"
                value={formData.vatRate}
                onChange={(value) => handleInputChange("vatRate", value)}
                min={1}
                max={30}
                step={1}
                suffix="%"
              />
            </div>

            {/* Checkboxes */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormField
                  label="Sõiduki seisukord"
                  placeholder="näide: uus"
                  value={formData.accident}
                  onChange={(value) => handleInputChange("accident", value)}
                  isSelect
                  options={[
                    {
                      value: "uus",
                      label: "Uus",
                    },
                    {
                      value: "kasutatud",
                      label: "Kasutatud",
                    },
                    {
                      value: "avariiline",
                      label: "Avariiline",
                    },
                  ]}
                />
                <FormField
                  label="VIN-kood"
                  placeholder="WDC000000000000"
                  value={formData.vinCode}
                  onChange={(value) => handleInputChange("vinCode", value)}
                />
              </div>
              <div className="my-auto space-y-3">
                <CheckboxField
                  label="Teostatud tehniline kontroll"
                  checked={checktechboxes.technicalInspection}
                  onChange={(checked) =>
                    handleCheckTechboxChange("technicalInspection", checked)
                  }
                />
                <CheckboxField
                  label="Teostatud tehniline hooldus"
                  checked={checktechboxes.technicalMaintenance}
                  onChange={(checked) =>
                    handleCheckTechboxChange("technicalMaintenance", checked)
                  }
                />
                <CheckboxField
                  label="Hooldusraamat"
                  checked={checktechboxes.serviceBook}
                  onChange={(checked) =>
                    handleCheckTechboxChange("serviceBook", checked)
                  }
                />
                <CheckboxField
                  label="Peida VIN kood"
                  checked={checktechboxes.hideVin}
                  onChange={(checked) =>
                    handleCheckTechboxChange("hideVin", checked)
                  }
                />
              </div>
            </div>
          </FormSection>

          {/* Technical Details */}
          <FormSection title="Tehnilised detailandmed">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FormField
                label="Kütuse tüüp"
                placeholder="Valik Kütuse tüüp"
                isSelect
                value={formData.fuelType}
                onChange={(value) => handleInputChange("fuelType", value)}
                options={[
                  {
                    value: "petrol",
                    label: "Bensiin",
                  },
                  {
                    value: "diesel",
                    label: "Diisel",
                  },
                  {
                    value: "hybrids",
                    label: "Hübriid",
                  },
                  {
                    value: "electric",
                    label: "Elektriline",
                  },
                ]}
              />
              <FormField
                label="Sõiduki number:"
                placeholder="AA00000"
                value={formData.plateNumber}
                onChange={(value) => handleInputChange("plateNumber", value)}
              />
              <FormField
                label="Kategooria"
                placeholder="Valik kategooria"
                isSelect
                value={formData.category}
                onChange={(value) => handleInputChange("category", value)}
                options={[
                  {
                    value: "hatchback",
                    label: "Hatchback",
                  },
                  {
                    value: "sedan",
                    label: "Sedan",
                  },
                  {
                    value: "suv",
                    label: "SUV",
                  },
                  {
                    value: "muv",
                    label: "MUV",
                  },
                  {
                    value: "coupe",
                    label: "Coupe",
                  },
                  {
                    value: "convertible",
                    label: "Convertible",
                  },
                  {
                    value: "pickup_truck",
                    label: "Pickup Truck",
                  },
                ]}
              />
              <FormField
                label="Käigukasti tüüp"
                placeholder="Automaat"
                isSelect
                value={formData.transmission}
                onChange={(value) => handleInputChange("transmission", value)}
                options={[
                  {
                    value: "maunaal",
                    label: "Maunaal",
                  },
                  {
                    value: "automaat",
                    label: "Automaat",
                  },
                  {
                    value: "poolautomaat",
                    label: "Poolautomaat",
                  },
                ]}
              />
              <FormField
                label="Tehnilised andmed"
                placeholder="Kasutatud, avariivaba ..."
                value={formData.technicalData}
                isSelect
                onChange={(value) => handleInputChange("technicalData", value)}
                options={[
                  {
                    value: "kasutatud",
                    label: "Kasutatud",
                  },
                  {
                    value: "avariivaba",
                    label: "Avariivaba",
                  },
                ]}
              />
              <FormField
                label="Omanike arv"
                placeholder="1"
                isSelect
                value={formData.ownerCount}
                onChange={(value) => handleInputChange("ownerCount", value)}
                options={[
                  {
                    value: "1",
                    label: "1",
                  },
                  {
                    value: "2",
                    label: "2",
                  },
                  {
                    value: "3",
                    label: "3",
                  },
                  {
                    value: "4+",
                    label: "4+",
                  },
                ]}
              />
              <FormField
                label="Veoskeem:"
                placeholder="Valik veoskeem"
                isSelect
                value={formData.drive_type_id}
                onChange={(value) => handleInputChange("drive_type_id", value)}
                options={[
                  {
                    value: "esivedu",
                    label: "Esivedu",
                  },
                  {
                    value: "tausted",
                    label: "Tausted",
                  },
                  {
                    value: "nelikvedu",
                    label: "Nelikvedu",
                  },
                ]}
              />
              <FormField
                label="Töömaht"
                placeholder="0"
                suffix="cm³"
                value={formData.displacement}
                onChange={(value) => handleInputChange("displacement", value)}
              />
            </div>
          </FormSection>

          {/* Equipment Section */}
          <FormSection title="Kõrgema väärtusega lisavarustus">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CheckboxField
                label="ABS"
                checked={checkboxes.abs}
                onChange={(checked) => handleCheckboxChange("abs", checked)}
              />
              <CheckboxField
                label="Käivitusabi mäkketõusul"
                checked={checkboxes.hillStartAssist}
                onChange={(checked) =>
                  handleCheckboxChange("hillStartAssist", checked)
                }
              />
              <CheckboxField
                label="Adaptiivne kurvituli"
                checked={checkboxes.adaptiveHeadlights}
                onChange={(checked) =>
                  handleCheckboxChange("adaptiveHeadlights", checked)
                }
              />
              <CheckboxField
                label="Pimestamisvaba kaugtuli"
                checked={checkboxes.automaticHighBeams}
                onChange={(checked) =>
                  handleCheckboxChange("automaticHighBeams", checked)
                }
              />
              <CheckboxField
                label="Häiresüsteem"
                checked={checkboxes.alarmSystem}
                onChange={(checked) =>
                  handleCheckboxChange("alarmSystem", checked)
                }
              />
              <CheckboxField
                label="Bluetooth"
                checked={checkboxes.bluetooth}
                onChange={(checked) =>
                  handleCheckboxChange("bluetooth", checked)
                }
              />
              <CheckboxField
                label="Ambiente valgustus"
                checked={checkboxes.ambientLighting}
                onChange={(checked) =>
                  handleCheckboxChange("ambientLighting", checked)
                }
              />
              <CheckboxField
                label="Bordcomputer (pardaarvuti)"
                checked={checkboxes.boardComputer}
                onChange={(checked) =>
                  handleCheckboxChange("boardComputer", checked)
                }
              />
              <CheckboxField
                label="Apple CarPlay"
                checked={checkboxes.appleCarplay}
                onChange={(checked) =>
                  handleCheckboxChange("appleCarplay", checked)
                }
              />
              <CheckboxField
                label="CD-mängija"
                checked={checkboxes.cdPlayer}
                onChange={(checked) =>
                  handleCheckboxChange("cdPlayer", checked)
                }
              />
              <CheckboxField
                label="Käetugi"
                checked={checkboxes.armrest}
                onChange={(checked) => handleCheckboxChange("armrest", checked)}
              />
              <CheckboxField
                label="Elektrilised aknatõstukid"
                checked={checkboxes.electricWindows}
                onChange={(checked) =>
                  handleCheckboxChange("electricWindows", checked)
                }
              />
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={() => setShowMoreEquipment(!showMoreEquipment)}
                className="flex items-center gap-2 px-5 py-3 border border-[#06d6a0] text-[#06d6a0] rounded-lg text-motorsoline-primary hover:bg-motorsoline-primary hover:text-white transition-colors"
              >
                <span>Näita rohkem</span>
                <ChevronDownIcon />
              </button>
            </div>
          </FormSection>

          {/* Description Section */}
          <FormSection title="">
            <TextAreaField
              label="Sõiduki kirjeldus müüja poolt"
              placeholder="Lisage kirjeldus"
              value={formData.description}
              onChange={(value) => handleInputChange("description", value)}
            />
          </FormSection>

          {/* Equipment Section */}
          <FormSection title="">
            <TextAreaField
              label="Varustus:"
              placeholder="Lisage varustus:"
              value={formData.equipment}
              onChange={(value) => handleInputChange("equipment", value)}
            />
          </FormSection>

          {/* Contact Section */}
          <FormSection title="Kontaktid">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="w-full">
                  <label className="block text-motorsoline-text text-lg font-medium mb-3">
                    Valik riik
                  </label>
                  <ReactFlagsSelect
                    className="w-full rounded-lg bg-white text-lg"
                    selected={formData.country}
                    onSelect={(value) => handleInputChange("country", value)}
                    placeholder="Select a Country"
                    searchable={true}
                  />
                </div>
              </div>
              <FormField
                label="Telefoninumber"
                placeholder="+49 000 0000000"
                value={formData.phone}
                onChange={(value) => handleInputChange("phone", value)}
              />
              <FormField
                label="Sotsiaalvõrgustik"
                placeholder="www.youtube.com/Näide"
                value={formData.socialNetwork}
                onChange={(value) => handleInputChange("socialNetwork", value)}
              />
              <FormField
                label="Ettevõte/eraisik"
                placeholder="Sisesta ettevõte"
                value={formData.businessType}
                onChange={(value) => handleInputChange("businessType", value)}
              />
              <FormField
                label="E-post"
                placeholder="Näide@elke.ee"
                type="email"
                value={formData.email}
                onChange={(value) => handleInputChange("email", value)}
              />
            </div>

            <div className="mt-6">
              <button className="flex items-center px-8 py-4 border border-brand-primary rounded-lg text-brand-primary hover:bg-motorsoline-primary hover:text-white transition-colors">
                + Lisa sotsiaalvõrgustik
              </button>
            </div>
          </FormSection>

          {/* Additional Info Section */}
          <FormSection title="">
            <TextAreaField
              label="Lisainfo"
              placeholder="Lisage lisainfo"
              value={formData.additionalInfo}
              onChange={(value) => handleInputChange("additionalInfo", value)}
            />
          </FormSection>

          <FormSection title="">
          <form onSubmit={handleCarSubmit} className="space-y-4">
            <button
              type="submit"
              className="bg-brand-primary text-white px-4 py-2 rounded font-semibold"
            >
              {editingCar ? "Salvesta muudatused" : "Lisa kuulutus"}
            </button>
            {editingCar && (
              <button
                type="button"
                className="bg-gray-300 px-4 py-2 rounded ml-2"
                onClick={() => {
                  setEditingCar(null);
                  setFormData({
                    brand_id: "",
                    model_id: "",
                    year_id: "",
                    drive_type_id: "",
                    category: "",
                    transmission: "",
                    fuelType: "",
                    plateNumber: "",
                    vehicleType: "",
                    bodyType: "",
                    month: "",
                    mileage: "",
                    power: "",
                    displacement: "",
                    technicalData: "",
                    ownerCount: "",
                    modelDetail: "",
                    price: "",
                    discountPrice: "",
                    warranty: "",
                    vatRefundable: "",
                    vatRate: "24",
                    accident: "",
                    vinCode: "",
                    description: "",
                    equipment: "",
                    additionalInfo: "",
                    country: "EE",
                    phone: "",
                    businessType: "",
                    socialNetwork: "",
                    email: "",
                  });
                  setCarImages(Array(40).fill(null));
                  setShowMorePhotos(false);
                  navigate("/user");
                }}
              >
                Tühista
              </button>
            )}
          </form>
        </FormSection>
        </div>
      </main>

      <Footer />
    </div>
  );
}

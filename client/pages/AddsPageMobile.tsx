import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

export default function AddsPageMobile() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    brand_id: "",
    model_id: "",
    category: "",
    transmission: "",
    fuelType: "",
    plateNumber: "",
    year_id: "",
    month: "",
    mileage: "",
    power: "",
    displacement: "",
    technicalData: "",
    ownerCount: "",
    drive_type_id: "",
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

  const [checkboxes, setCheckboxes] = useState({
    technicalInspection: false,
    technicalMaintenance: false,
    serviceBook: false,
    hideVin: false,
    // Equipment checkboxes
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
  const [selectedCountry, setSelectedCountry] = useState("");
  const [carImages, setCarImages] = useState<(File | null)[]>(Array(8).fill(null));
  
  // Data for dropdowns
  const [brands, setBrands] = useState<{ id: number; name: string }[]>([]);
  const [models, setModels] = useState<{ id: number; name: string }[]>([]);
  const [years, setYears] = useState<{ id: number; value: string }[]>([]);
  const [driveTypes, setDriveTypes] = useState<{ id: number; name: string; ee_name: string }[]>([]);

  // Fetch dropdown data on component mount
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [brandsRes, yearsRes, driveTypesRes] = await Promise.all([
          axios.get('/api/brands'),
          axios.get('/api/years'),
          axios.get('/api/drive-types')
        ]);
        
        setBrands(brandsRes.data);
        setYears(yearsRes.data);
        setDriveTypes(driveTypesRes.data);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };

    fetchDropdownData();
  }, []);

  // Fetch models when brand changes
  useEffect(() => {
    const fetchModels = async () => {
      if (formData.brand_id) {
        try {
          const response = await axios.get(`/api/models?brand_id=${formData.brand_id}`);
          setModels(response.data);
        } catch (error) {
          console.error('Error fetching models:', error);
        }
      } else {
        setModels([]);
      }
    };

    fetchModels();
  }, [formData.brand_id]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setCheckboxes((prev) => ({ ...prev, [field]: checked }));
  };

  const handleCarImageChange = (index: number, file: File | null) => {
    setCarImages((prev) => {
      const updated = [...prev];
      updated[index] = file;
      return updated;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Validate required fields
      const requiredFields = ['brand_id', 'model_id', 'year_id', 'price', 'phone', 'email'];
      const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      // Check if at least one image is uploaded
      if (!carImages.some(img => img !== null)) {
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
        if (file) {
          formDataObj.append(`image_${idx + 1}`, file);
        }
      });

      // Add checkboxes
      const techCheckSelected = Object.entries(checkboxes)
        .filter(([k, v]) => v && ['technicalInspection', 'technicalMaintenance', 'serviceBook', 'hideVin'].includes(k))
        .map(([k]) => k);
      
      const accessoriesSelected = Object.entries(checkboxes)
        .filter(([k, v]) => v && !['technicalInspection', 'technicalMaintenance', 'serviceBook', 'hideVin'].includes(k))
        .map(([k]) => k);

      formDataObj.append('tech_check', techCheckSelected.join(','));
      formDataObj.append('accessories', accessoriesSelected.join(','));

      // Get auth token
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error('Please log in to create a car listing');
      }

      // Submit to server
      const response = await axios.post("/api/cars", formDataObj, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });

      console.log('Car created successfully:', response.data);
      
      // Reset form and redirect
      setFormData({
        brand_id: "",
        model_id: "",
        category: "",
        transmission: "",
        fuelType: "",
        plateNumber: "",
        year_id: "",
        month: "",
        mileage: "",
        power: "",
        displacement: "",
        technicalData: "",
        ownerCount: "",
        drive_type_id: "",
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
      setCheckboxes({
        technicalInspection: false,
        technicalMaintenance: false,
        serviceBook: false,
        hideVin: false,
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
      setCarImages(Array(8).fill(null));
      
      // Navigate to user's listings
      navigate("/user");
      
    } catch (error: any) {
      console.error('Error creating car:', error);
      setSubmitError(error.response?.data?.message || error.message || 'An error occurred while creating the car listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-motorsoline-text text-3xl font-semibold mb-8">
          Loo kuulutus
        </h1>

        {/* Error message */}
        {submitError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{submitError}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Photo Upload Section */}
          <FormSection title="Fotod">
            <PhotoUpload 
              images={carImages}
              onImageChange={handleCarImageChange}
              maxFileSize={5}
            />
          </FormSection>

          {/* Vehicle Details */}
          <FormSection title="Mudelidetailid">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FormField
                label="Vali bränd"
                placeholder="Vali Bränd"
                isSelect
                value={formData.brand_id}
                onChange={(value) => handleInputChange("brand_id", value)}
                options={brands.map(brand => ({ value: brand.id.toString(), label: brand.name }))}
              />
              <FormField
                label="Mudel"
                placeholder="Vali mudel"
                isSelect
                value={formData.model_id}
                onChange={(value) => handleInputChange("model_id", value)}
                options={models.map(model => ({ value: model.id.toString(), label: model.name }))}
                disabled={!formData.brand_id}
              />
              <FormField
                label="Esmane registreerimine"
                placeholder="Aasta"
                isSelect
                value={formData.year_id}
                onChange={(value) => handleInputChange("year_id", value)}
                options={years.map(year => ({ value: year.id.toString(), label: year.value }))}
              />
              <div className="space-y-3">
                <label className="block text-motorsoline-text text-lg font-medium">
                  &nbsp;
                </label>
                <select
                  value={formData.month}
                  onChange={(e) => handleInputChange("month", e.target.value)}
                  className="w-full h-14 px-5 rounded-lg border border-motorsoline-form-border bg-white text-lg text-motorsoline-placeholder appearance-none focus:outline-none focus:ring-2 focus:ring-motorsoline-primary focus:border-transparent"
                >
                  <option value="">Kuu</option>
                  <option value="01">Jaanuar</option>
                  <option value="02">Veebruar</option>
                  <option value="03">Märts</option>
                  <option value="04">Aprill</option>
                  <option value="05">Mai</option>
                  <option value="06">Juuni</option>
                  <option value="07">Juuli</option>
                  <option value="08">August</option>
                  <option value="09">September</option>
                  <option value="10">Oktoober</option>
                  <option value="11">November</option>
                  <option value="12">Detsember</option>
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
                placeholder="Vali mudel"
                value={formData.modelDetail}
                onChange={(value) => handleInputChange("modelDetail", value)}
              />
              <FormField
                label="Hind"
                placeholder="€"
                value={formData.price}
                onChange={(value) => handleInputChange("price", value)}
              />
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
                placeholder="Jah"
                isSelect
                value={formData.vatRefundable}
                onChange={(value) => handleInputChange("vatRefundable", value)}
                options={[
                  { value: "yes", label: "Jah" },
                  { value: "no", label: "Ei" }
                ]}
              />
              <FormField
                label="Käibemaksumäär"
                placeholder="Palun vali"
                isSelect
                value={formData.vatRate}
                onChange={(value) => handleInputChange("vatRate", value)}
                options={[
                  { value: "0", label: "0%" },
                  { value: "9", label: "9%" },
                  { value: "20", label: "20%" },
                  { value: "24", label: "24%" }
                ]}
              />
              <FormField
                label="Avariiline"
                placeholder="näide: osad kaasa"
                value={formData.accident}
                onChange={(value) => handleInputChange("accident", value)}
              />
              <FormField
                label="VIN-kood"
                placeholder="WDC000000000000"
                value={formData.vinCode}
                onChange={(value) => handleInputChange("vinCode", value)}
              />
            </div>

            {/* Checkboxes */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <CheckboxField
                label="Teostatud tehniline kontroll"
                checked={checkboxes.technicalInspection}
                onChange={(checked) =>
                  handleCheckboxChange("technicalInspection", checked)
                }
              />
              <CheckboxField
                label="Teostatud tehniline hooldus"
                checked={checkboxes.technicalMaintenance}
                onChange={(checked) =>
                  handleCheckboxChange("technicalMaintenance", checked)
                }
              />
              <CheckboxField
                label="Houldusraamat"
                checked={checkboxes.serviceBook}
                onChange={(checked) =>
                  handleCheckboxChange("serviceBook", checked)
                }
              />
              <CheckboxField
                label="Peida VIN-kod"
                checked={checkboxes.hideVin}
                onChange={(checked) => handleCheckboxChange("hideVin", checked)}
              />
            </div>
          </FormSection>

          {/* Technical Details */}
          <FormSection title="Tehnilised andmed">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FormField
                label="Kategooria"
                placeholder="Vali kategooria"
                isSelect
                value={formData.category}
                onChange={(value) => handleInputChange("category", value)}
                options={[
                  { value: "car", label: "Auto" },
                  { value: "suv", label: "SUV" },
                  { value: "van", label: "Väikebuss" },
                  { value: "truck", label: "Veoauto" }
                ]}
              />
              <FormField
                label="Kütuse tüüp"
                placeholder="Vali Kütuse tüüp"
                isSelect
                value={formData.fuelType}
                onChange={(value) => handleInputChange("fuelType", value)}
                options={[
                  { value: "petrol", label: "Bensiin" },
                  { value: "diesel", label: "Diisel" },
                  { value: "hybrid", label: "Hübriid" },
                  { value: "electric", label: "Elektri" },
                  { value: "lpg", label: "Gaas" }
                ]}
              />
              <FormField
                label="Sõiduki number:"
                placeholder="AA00000"
                value={formData.plateNumber}
                onChange={(value) => handleInputChange("plateNumber", value)}
              />
              <FormField
                label="Käigukasti tüüp"
                placeholder="Automaat"
                isSelect
                value={formData.transmission}
                onChange={(value) => handleInputChange("transmission", value)}
                options={[
                  { value: "manual", label: "Käsikäik" },
                  { value: "automatic", label: "Automaat" },
                  { value: "semi_auto", label: "Poolautomaat" }
                ]}
              />
              <FormField
                label="Tehnilised andmed"
                placeholder="Kasutatud, avariivaba ..."
                value={formData.technicalData}
                onChange={(value) => handleInputChange("technicalData", value)}
              />
              <FormField
                label="Omanike arv"
                placeholder="1"
                isSelect
                value={formData.ownerCount}
                onChange={(value) => handleInputChange("ownerCount", value)}
                options={[
                  { value: "1", label: "1 omanik" },
                  { value: "2", label: "2 omanikku" },
                  { value: "3", label: "3 omanikku" },
                  { value: "4+", label: "4+ omanikku" }
                ]}
              />
              <FormField
                label="Veoskeem:"
                placeholder="Vali veoskeem"
                isSelect
                value={formData.drive_type_id}
                onChange={(value) => handleInputChange("drive_type_id", value)}
                options={driveTypes.map(dt => ({ value: dt.id.toString(), label: dt.ee_name }))}
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
                    Vali riik
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
                placeholder="Vali ettevõte"
                isSelect
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
              <button className="flex items-center px-8 py-4 border border-motorsoline-primary rounded-lg text-motorsoline-primary hover:bg-motorsoline-primary hover:text-white transition-colors">
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

          {/* Submit Button */}
          <div className="flex justify-start">
            <button
              onClick={handleSubmit}
              className="flex items-center px-8 py-4 bg-motorsoline-primary rounded-lg text-white hover:bg-motorsoline-secondary transition-colors font-medium"
            >
              Lisa kuulutus
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

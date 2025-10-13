import React, { useState, useEffect, useMemo } from "react";
import PageContainer from "@/components/PageContainer";
import PhotoUpload from "@/components/PhotoUpload";
import FormSection, {
  FormField,
  TextAreaField,
  CheckboxField,
} from "@/components/FormSection";
import ReactFlagsSelect from "react-flags-select";
import LanguageSelect from '@/components/LanguageSelect';
import Select from "react-select";
import countryList from "react-select-country-list";
import MultiLanguageSelect from '@/components/MultiLanguageSelect';
import MultiCountrySelect from '@/components/MultiCountrySelect';
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { boolean } from "zod/v4";
import { CountryCodes } from "react-flags-select/build/types";
import { useI18n } from "@/contexts/I18nContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CarPreview from "./CarPage/CarPreview";
const ChevronDownIcon = ({ className = "" }: { className?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M8.5002 11.6997C8.03353 11.6997 7.56686 11.5197 7.21353 11.1664L2.86686 6.81968C2.67353 6.62635 2.67353 6.30635 2.86686 6.11302C3.0602 5.91968 3.3802 5.91968 3.57353 6.11302L7.9202 10.4597C8.2402 10.7797 8.7602 10.7797 9.0802 10.4597L13.4269 6.11302C13.6202 5.91968 13.9402 5.91968 14.1335 6.11302C14.3269 6.30635 14.3269 6.62635 14.1335 6.81968L9.78686 11.1664C9.43353 11.5197 8.96686 11.6997 8.5002 11.6997Z"
      fill="#06D6A0"
      stroke="#06D6A0"
      strokeWidth="0.5"
    />
  </svg>
);
const techCheckOptions=( t: any ) => [
  { key: 'technicalInspection', label: t('formLabels.inspection') },
  { key: 'technicalMaintenance', label: t('formLabels.technicalMaintenance') },
  { key: 'serviceBook', label: t('formLabels.serviceBook') },
  { key: 'hideVin', label: t('formLabels.hideVin') },
];
const accessoriesOptions = ( t: any ) => [
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
  { key: 'panoraamkatusklaasist', label: 'Panoraamkatus (klaasist)' },
  { key: 'katuseluuk', label: 'Katuseluuk' },
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

const carColorOptions = ( t: any ) => [
  { value: "beež", label: t('colors.beige') },
  { value: "helebeež", label: t('colors.lightBeige') },
  { value: "hall", label: t('colors.grey') },
  { value: "helehall", label: t('colors.lightGrey') },
  { value: "hellkollane", label: t('colors.lightYellow') },
  { value: "helelilla", label: t('colors.lightPurple') },
  { value: "heleanž", label: t('colors.lightOrange') },
  { value: "helepruun", label: t('colors.lightBrown') },
  { value: "helepunane", label: t('colors.lightRed') },
  { value: "heleroheline", label: t('colors.brown') },
  { value: "helesinine", label: t('colors.lightBlue') },
  { value: "hõbedane", label: t('colors.silver') },
  { value: "kollane", label: t('colors.yellow') },
  { value: "kuldne", label: t('colors.golden') },
  { value: "lilla", label: t('colors.purple') },
  { value: "heleoranž", label: t('colors.lightOrange') },
  { value: "must", label: t('colors.black') },
  { value: "oranž", label: t('colors.orange') },
  { value: "pruun", label: t('colors.brown') },
  { value: "punane", label: t('colors.red') },
  { value: "roheline", label: t('colors.green') },
  { value: "roosa", label: t('colors.pink') },
  { value: "sinine", label: t('colors.blue') },
  { value: "tumebeež", label: t('colors.darkBeige') },
  { value: "tumehall", label: t('colors.darkGrey') },
  { value: "tumekollane", label: t('colors.darkYellow') },
  { value: "tumelilla", label: t('colors.darkPurple') },
  { value: "tumeoranž", label: t('colors.darkOrange') },
  { value: "tumerpruun", label: t('colors.darkBrown') },
  { value: "tumepunane", label: t('colors.darkRed') },
  { value: "tumeroheline", label: t('colors.darkGreen') },
  { value: "tumesinine", label: t('colors.darkBlue') },
  { value: "valge", label: t('colors.white') },
];

const salonColorOptions = ( t: any ) => [
  { value: "must", label: t('colors.black') },
  { value: "hall", label: t('colors.grey') },
  { value: "beež", label: t('colors.beige') },
  { value: "pruun", label: t('colors.brown') },
  { value: "punane", label: t('colors.red') },
  { value: "sinine", label: t('colors.blue') },
  { value: "roheline", label: t('colors.green') },
  { value: "kollane", label: t('colors.yellow') },
  { value: "lilla", label: t('colors.purple') },
  { value: "oranž", label: t('colors.orange') },
  { value: "valge", label: t('colors.white') },
  { value: "muu", label: t('vehicleTypes.other') },
];

const inspectionValidityOptions = [
  { value: "", label: "otsi" },
  { value: "09.2025", label: "09.2025" },
  { value: "10.2025", label: "10.2025" },
  { value: "11.2025", label: "11.2025" },
  { value: "12.2025", label: "12.2025" },
  { value: "01.2026", label: "01.2026" },
  { value: "02.2026", label: "02.2026" },
  { value: "03.2026", label: "03.2026" },
  { value: "04.2026", label: "04.2026" },
  { value: "05.2026", label: "05.2026" },
  { value: "06.2026", label: "06.2026" },
  { value: "07.2026", label: "07.2026" },
  { value: "08.2026", label: "08.2026" },
  { value: "09.2026", label: "09.2026" },
  { value: "10.2026", label: "10.2026" },
  { value: "11.2026", label: "11.2026" },
  { value: "12.2026", label: "12.2026" },
  { value: "01.2027", label: "01.2027" },
  { value: "02.2027", label: "02.2027" },
  { value: "03.2027", label: "03.2027" },
  { value: "04.2027", label: "04.2027" },
  { value: "05.2027", label: "05.2027" },
  { value: "06.2027", label: "06.2027" },
  { value: "07.2027", label: "07.2027" },
  { value: "08.2027", label: "08.2027" },
  { value: "09.2027", label: "09.2027" },
  { value: "10.2027", label: "10.2027" },
  { value: "11.2027", label: "11.2027" },
  { value: "12.2027", label: "12.2027" },
  { value: "01.2028", label: "01.2028" },
  { value: "02.2028", label: "02.2028" },
  { value: "03.2028", label: "03.2028" },
  { value: "04.2028", label: "04.2028" },
  { value: "05.2028", label: "05.2028" },
  { value: "06.2028", label: "06.2028" },
  { value: "07.2028", label: "07.2028" },
  { value: "08.2028", label: "08.2028" },
  { value: "09.2028", label: "09.2028" },
  { value: "10.2028", label: "10.2028" },
  { value: "11.2028", label: "11.2028" },
  { value: "12.2028", label: "12.2028" },
];

export default function AddsPage() {
  const options = useMemo(() => countryList().getData(), []);
  const { user } = useAuth();
  const { t , currentLanguage } = useI18n();

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
    carColor: "",
    carColorType: "",
    salonColor: "",
    description: "",
    equipment: "",
    additionalInfo: "",
    stereo: "",
    valuveljed: "",
    inspectionValidityPeriod: "",
    seats: "",
    doors: "",
    major: "",
  });

  const [contactFormData, setContactFormData] = useState({
    phone: "",
    businessType: "",
    socialNetwork: "",
    email: "",
    address: "",
    website: "",
    language: [],
    country: "",
  });

  const [contactSaved, setContactSaved] = useState(false);

  const [checktechboxes, setCheckTechboxes] = useState({
    technicalInspection: false,
    technicalMaintenance: false,
    serviceBook: false,
    hideVin: false,
    inspectionValid: false,
  });

  const [checkboxes, setCheckboxes] = useState({
    kokkupõrgetennetavpidurisüsteem: false,
    pimenurgahoiatus: false,
    sõidurajahoidmiseabisüsteem: false,
    sõidurajavahetamiseabisüsteem: false,
    adaptiivnepüsikiirusehoidja: false,
    liiklusmärkidetuvastusjakuvamine: false,
    parkimisandurideesjataga: false,
    parkimiskaamera: false,
    parkimiskaamera360: false,
    kaugtuledeümberlülitamiseassistent: false,
    LEDesituled: false,
    Xenonesituled: false,
    Lasersituled: false,
    elektriliseoojendusegaesiklaas: false,
    kliimaseade: false,
    salongieelsoojendus: false,
    mootoriEelsoojendus: false,
    salongilisasoojendus: false,
    istmesoojendused: false,
    elektriliseltreguleeritavadIstmed: false,
    comfortistmed: false,
    sportistmed: false,
    nahkpolster: false,
    poolnahkpolster: false,
    tagaistmeseljatugiallaklapitav: false,
    eraldikliimaseadetagaistmetele: false,
    võtmetavamine: false,
    võtmetaäivitus: false,
    pakiruumiavaminejasulgeminelektriliselt: false,
    soojendusegarool: false,
    ventileeritavadstmed: false,
    massaažifunktsioonigaiistmed: false,
    infokuvamineesiklaasile: false,
    panoraamkatusklaasist: false,
    katuseluuk: false,
    usteservosulgurid: false,
    topeltklaasid: false,
    rulookardinadustel: false,
    integreeritudväravapult: false,
    AppleCarPlay: false,
    AndroidAuto: false,
    stereo: false,
    õhkvedrustus: false,
    reguleeritavvedrustus: false,
    rattaPööramine: false,
    veokonks: false,
    elektrilisedliuguksed: false,
    öisenägemiseassistent: false,
    valgustuspakett: false,
    suverehvid: false,
    talverehvid: false,
    valuveljed: false,
  });

  const [showMoreEquipment, setShowMoreEquipment] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [stereoInput, setStereoInput] = useState("");
  const [cars, setCars] = useState<any[]>([]);
  const [editingCar, setEditingCar] = useState<any | null>(null);
  const [modelLoading, setModelLoading] = useState<boolean>(false);
  const [carLoading, setCarLoading] = useState<boolean>(false);
  const [carImages, setCarImages] = useState<(File | null)[]>(
    Array(40).fill(null),
  );
  const [showMorePhotos, setShowMorePhotos] = useState(false);
  const [brands, setBrands] = useState<{ id: number; name: string }[]>([]);
  const [models, setModels] = useState<{ id: number; name: string }[]>([]);
  const [years, setYears] = useState<{ id: number; value: string }[]>([]);
  const [driveTypes, setDriveTypes] = useState<{ id: number; name: string; ee_name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { id: carId } = useParams<{ id: string }>();

  // Function to load existing contact data for the user
  const loadUserContactData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const contactResponse = await axios.get(`/api/contacts/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (contactResponse.data) {
          setContactFormData({
            phone: contactResponse.data.phone || "",
            businessType: contactResponse.data.businessType || "",
            socialNetwork: contactResponse.data.socialNetwork || "",
            email: contactResponse.data.email || "",
            address: contactResponse.data.address || "",
            website: contactResponse.data.website || "",
            language: contactResponse.data.language ? (Array.isArray(contactResponse.data.language) ? contactResponse.data.language : contactResponse.data.language.split(',')) : [],
            country: contactResponse.data.country || "",
          });
          setContactSaved(true); // Mark as saved since we loaded existing data
          console.log('Loaded existing contact data:', contactResponse.data);
        }
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        // No contact found - this is normal for new users
        console.log('No existing contact data found for user');
        setContactSaved(false);
      } else {
        console.log('Error loading contact data:', error);
        setContactSaved(false);
      }
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([
        fetchCars(),
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
            // const vatRate = parseFloat(car.vatRate.toString());
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
            major: car.major?.toString() || "",
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
              techCheckOptions(t).forEach(opt => {
                obj[opt.key] = arr.includes(opt.key);
              });
              return obj;
            });
          }
          if (car.accessories) {
            const arr = Array.isArray(car.accessories) ? car.accessories : car.accessories.split(',');
            setCheckboxes((prev) => {
              const obj: any = {};
              accessoriesOptions(t).forEach(opt => {
                obj[opt.key] = arr.includes(opt.key);
              });
              return obj;
            });
          }

          // Load contact data from contacts API for editing
          const loadContactData = async () => {
            try {
              const token = localStorage.getItem("token");
              if (token) {
                const contactResponse = await axios.get(`/api/contacts/user`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                if (contactResponse.data) {
                  setContactFormData({
                    phone: contactResponse.data.phone || "",
                    businessType: contactResponse.data.businessType || "",
                    socialNetwork: contactResponse.data.socialNetwork || "",
                    email: contactResponse.data.email || "",
                    address: contactResponse.data.address || "",
                    website: contactResponse.data.website || "",
                    language: contactResponse.data.language ? (Array.isArray(contactResponse.data.language) ? contactResponse.data.language : contactResponse.data.language.split(',')) : [],
                    country: contactResponse.data.country || "",
                  });
                  setContactSaved(true); // Mark as saved since we loaded existing data
                } else {
                  setContactSaved(false); // No existing contact data
                }
              }
            } catch (error: any) {
              console.log('Error loading contact data:', error);
              setContactSaved(false);
            }
          };

          loadContactData();
          // if (car.country) {
          //   const arr = Array.isArray(car.country) ? car.country : car.country.split(',');
          //   setFormData((prev) => ({ ...prev, country: arr }));
          // } else {
          //   setFormData((prev) => ({ ...prev, country: [] }));
          // }
        } else {
          // If car not found, redirect to user page
          navigate(`/${currentLanguage}/user`);
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
        } else {
          // For new cars, load user's existing contact data
          await loadUserContactData();
        }
      }
    };

    initializeData().finally(() => {
      setIsLoading(false);
    });

    // Load pending contact data from localStorage if it exists (only for new cars, not editing)
    // This will be overridden by loadUserContactData() if backend data exists
    if (!carId) {
      const pendingContactData = localStorage.getItem('pendingContactData');
      if (pendingContactData) {
        try {
          const parsedData = JSON.parse(pendingContactData);
          setContactFormData(parsedData);
          setContactSaved(true); // Mark as saved since it was previously saved
        } catch (error) {
          console.error('Error loading pending contact data:', error);
        }
      }
    }
  }, [carId]);

  // Auto-select first option for selects on add (not edit)
  useEffect(() => {
    if (!editingCar) {
      // Set brand_id - don't auto-select, let placeholder show "Vali"
      if (brands.length > 0 && !formData.brand_id) {
        setFormData((prev) => ({ ...prev, brand_id: "" }));
      }
      // Set model_id - don't auto-select, let placeholder show "Vali"
      if (models.length > 0 && !formData.model_id) {
        setFormData((prev) => ({ ...prev, model_id: "" }));
      }
      // Set year_id to 2025 by default
      if (years.length > 0 && !formData.year_id) {
        // const year2025 = years.find(y => y.value === "2025");
        // if (year2025) {
        //   setFormData((prev) => ({ ...prev, year_id: year2025.id.toString() }));
        // } else {
        // Fallback to first year if 2025 not found
        setFormData((prev) => ({ ...prev, year_id: "" }));
        // }
      }
      // Set month - don't auto-select, let placeholder show
      if (!formData.month) {
        setFormData((prev) => ({ ...prev, month: "" }));
      }
      // Set vatRefundable
      if (!formData.vatRefundable) {
        setFormData((prev) => ({ ...prev, vatRefundable: "" }));
      }
      // Set vatRate
      if (!formData.vatRate) {
        setFormData((prev) => ({ ...prev, vatRate: "" }));
      }
      // Set ownerCount
      if (!formData.ownerCount) {
        setFormData((prev) => ({ ...prev, ownerCount: "" }));
      }
      // Set drive_type_id
      if (driveTypes.length > 0 && !formData.drive_type_id) {
        setFormData((prev) => ({ ...prev, drive_type_id: "" }));
      }
      // Set transmission
      if (!formData.transmission) {
        setFormData((prev) => ({ ...prev, transmission: "" }));
      }
      // Set fuelType
      if (!formData.fuelType) {
        setFormData((prev) => ({ ...prev, fuelType: "" }));
      }
      // Set vehicleType
      if (!formData.vehicleType) {
        setFormData((prev) => ({ ...prev, vehicleType: "" }));
      }
      // Set category
      if (!formData.category) {
        setFormData((prev) => ({ ...prev, category: "" }));
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
    try {
      setModelLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/models?brand_id=${brand_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setModels(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setModelLoading(false);
    }
  };

  const fetchCars = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("/api/cars", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCars(res.data);
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

  const handleContactInputChange = (field: string, value: string | string[]) => {
    setContactFormData((prev) => ({ ...prev, [field]: value }));
    setContactSaved(false); // Reset saved state when data changes
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setCheckboxes((prev) => ({ ...prev, [field]: checked }));
  };

  const handleCheckTechboxChange = (field: string, checked: boolean) => {
    setCheckTechboxes((prev) => ({ ...prev, [field]: checked }));
  };

  const handleStereoInputChange = (value: string) => {
    setStereoInput(value);
  };

  const handleLanguageChange = (languages: string[]) => {
    setContactFormData((prev) => ({ ...prev, language: languages }));
    setContactSaved(false); // Reset saved state when data changes
  };

  // Function to save contact data independently
  const handleSaveContact = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to save contact information");
      return;
    }

    // Check if we have any contact data to save
    const hasContactData = contactFormData.phone ||
      contactFormData.businessType ||
      contactFormData.socialNetwork ||
      contactFormData.email ||
      contactFormData.address ||
      contactFormData.website ||
      contactFormData.language?.length > 0 ||
      contactFormData.country;

    if (!hasContactData) {
      alert("Please fill in at least one contact field before saving");
      return;
    }
    try {
      // Check if contact data already exists for this user
      try {
        const existingContact = await axios.get(`/api/contacts/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(existingContact.data)
        if (existingContact.data) {
          // Update existing contact
          await axios.put(`/api/contacts/user`, contactFormData, {
            headers: { Authorization: `Bearer ${token}` },
          });
          alert("Contact information updated successfully!");
          console.log(existingContact.data)
          setContactSaved(true);
        }
      } catch (error: any) {
        if (!error.response?.status || error.response?.status === 404) {
          // Contact doesn't exist, create new one
          await axios.post("/api/contacts/user", contactFormData, {
            headers: { Authorization: `Bearer ${token}` },
          });
          alert("Contact information saved successfully!");
          setContactSaved(true);
        } else {
          throw error;
        }
        console.log(error);
      }
    } catch (error: any) {
      console.error('Error saving contact:', error);
      alert("Failed to save contact information");
    }
  };
  const handleDeleteContact = () => {
    localStorage.removeItem('pendingContactData');
    setContactFormData({
      phone: "",
      businessType: "",
      socialNetwork: "",
      email: "",
      address: "",
      website: "",
      language: [],
      country: "",
    });
    setContactSaved(false);
  };

  // const handleCountryChange = (countries: string[]) => {
  //   setFormData((prev) => ({ ...prev, country: countries }));
  // };

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

  const handleCarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields before submission
    if (!formData.brand_id || formData.brand_id === '') {
      alert('Palun valige mark');
      return;
    }
    if (!formData.model_id || formData.model_id === '') {
      alert('Palun valige mudel');
      return;
    }
    if (!formData.year_id || formData.year_id === '') {
      alert('Palun valige aasta');
      return;
    }
    if (!formData.drive_type_id || formData.drive_type_id === '') {
      alert('Palun valige veoskeem');
      return;
    }

    const form = { ...formData };
    // Map checkboxes to form fields if needed
    const formDataObj = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if ((key === 'language' || key === 'country') && Array.isArray(value)) {
        formDataObj.append(key, value.join(','));
      } else {
        formDataObj.append(key, value as string);
      }
    });
    carImages.forEach((file, idx) => {
      if (file) formDataObj.append(`image_${idx + 1}`, file);
    });

    const techCheckSelected = Object.entries(checktechboxes)
      .filter(([k, v]) => v)
      .map(([k]) => k);
    const accessoriesSelected = Object.entries(checkboxes)
      .filter(([k, v]) => v)
      .map(([k]) => k);
    formDataObj.append('tech_check', techCheckSelected.join(','));
    formDataObj.append('accessories', accessoriesSelected.join(','));
    const token = localStorage.getItem("token");

    try {
      setCarLoading(true);
      if (editingCar) {
        console.log('Editing Car:', editingCar);
        await axios.put(`/api/cars/${editingCar.id}`, formDataObj, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        console.log('Form Data:', formDataObj);
        console.log('Contact Form Data:', contactFormData);

        // Send car data first
        const carResponse = await axios.post("/api/cars", formDataObj, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Check for pending contact data in localStorage
        const pendingContactData = localStorage.getItem('pendingContactData');
        let contactDataToSave = contactFormData;

        if (pendingContactData) {
          try {
            contactDataToSave = JSON.parse(pendingContactData);
            // Clear the pending data from localStorage
            // localStorage.removeItem('pendingContactData');
          } catch (error) {
            console.error('Error parsing pending contact data:', error);
          }
        }

        // Send contact data separately if it exists
        if (contactDataToSave.phone || contactDataToSave.businessType || contactDataToSave.socialNetwork ||
          contactDataToSave.email || contactDataToSave.address || contactDataToSave.website ||
          contactDataToSave.language || contactDataToSave.country) {
          await axios.post("/api/contacts/user", contactDataToSave, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      }
      setEditingCar(null);
      setCarImages(Array(40).fill(null));
      setShowMorePhotos(false);
      setStereoInput("");
      fetchCars();

      // Close the modal
      setIsModalOpen(false);

      // Navigate to user's listings after successful add or edit
      navigate(`/${currentLanguage}/user`);
    } catch (error: any) {
      console.error('Error submitting car:', error, editingCar);
      if (error.response?.data?.message) {
        alert(`Viga: ${error.response.data.message}`);
      } else {
        alert('Viga kuulutuse salvestamisel. Palun proovige uuesti.');
      }
    } finally {
      setCarLoading(false);
    }
  };

  const handleEditCar = (car: any) => {
    setEditingCar(car);

    console.log('Editing Car:', car);

    // Calculate base price if VAT is applied
    let priceToShow = car.price?.toString() || "";
    if (car.vatRefundable === 'yes' && car.price && car.vatRate) {
      const totalPrice = parseFloat(car.price.toString());
      // const vatRate = parseFloat(car.vatRate.toString());
      const vatRate = 24;

      if (!isNaN(totalPrice) && !isNaN(vatRate)) {
        const basePrice = calculateBasePriceFromTotal(totalPrice, vatRate);
        priceToShow = basePrice.toString();
      }
    }

    // Separate contact fields from car data
    const { phone, businessType, socialNetwork, email, address, website, language, country, ...carData } = car;

    setFormData((prev) => ({
      ...prev,
      ...carData,
      price: priceToShow,
    }));

    // Set contact form data separately
    setContactFormData({
      phone: phone || "",
      businessType: businessType || "",
      socialNetwork: socialNetwork || "",
      email: email || "",
      address: address || "",
      website: website || "",
      language: language ? (Array.isArray(language) ? language : language.split(',')) : [],
      country: country || "",
    });
    setCarImages(Array(40).fill(null));
    setShowMorePhotos(false);
    console.log('Contact Form Data:', contactFormData);
    // Fetch models for the selected brand when editing
    if (car.brand_id) {
      fetchModels(car.brand_id.toString());
    }

    // if (car.tech_check) {
    //   const arr = Array.isArray(car.tech_check) ? car.tech_check : car.tech_check.split(',');
    //   setCheckTechboxes((prev) => {
    //     const obj: any = {};
    //     techCheckOptions.forEach(opt => {
    //       obj[opt.key] = arr.includes(opt.key);
    //     });
    //     return obj;
    //   });
    // }
    // if (car.accessories) {
    //   const arr = Array.isArray(car.accessories) ? car.accessories : car.accessories.split(',');
    //   setCheckboxes((prev) => {
    //     const obj: any = {};
    //     accessoriesOptions.forEach(opt => {
    //       obj[opt.key] = arr.includes(opt.key);
    //     });
    //     return obj;
    //   });
    // }

    // Language is now handled in contactFormData above
    // Load country array if it exists
    // if (car.country) {
    //   const countryArray = Array.isArray(car.country) ? car.country : car.country.split(',');
    //   setFormData((prev) => ({ ...prev, country: countryArray }));
    // } else {
    //   setFormData((prev) => ({ ...prev, country: [] }));
    // }

    // Load contact data from contacts table if it exists
    const loadContactData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const contactResponse = await axios.get(`/api/contacts/car/${car.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (contactResponse.data) {
            setContactFormData({
              phone: contactResponse.data.phone || "",
              businessType: contactResponse.data.businessType || "",
              socialNetwork: contactResponse.data.socialNetwork || "",
              email: contactResponse.data.email || "",
              address: contactResponse.data.address || "",
              website: contactResponse.data.website || "",
              language: contactResponse.data.language ? (Array.isArray(contactResponse.data.language) ? contactResponse.data.language : contactResponse.data.language.split(',')) : [],
              country: contactResponse.data.country || "",
            });
            setContactSaved(true); // Mark as saved since we loaded existing data
          } else {
            setContactSaved(false); // No existing contact data
          }
        }
      } catch (error) {
        console.log('No contact data found or error loading contact data:', error);
        setContactSaved(false); // No existing contact data
      }
    };

    loadContactData();
  };
  const handleDeleteCar = async (id: number) => {
    const token = localStorage.getItem("token");
    await axios.delete(`/api/cars/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCars();
  };
  // Calculate VAT price for display
  const calculateVatPrice = () => {
    if (formData.vatRefundable === 'yes' && formData.price && formData.vatRate) {
      const basePrice = parseFloat(formData.price);
      // const vatRate = parseFloat(formData.vatRate);
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
  if (isLoading) {
    return (
      <PageContainer>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[100px] py-16">
          <div className="text-center">
            <h1 className="text-motorsoline-text text-3xl font-semibold mb-8">
              {t('common.loading')}
            </h1>
          </div>
        </div>
      </PageContainer>
    );
  }
  return (
    <PageContainer>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[100px] py-16">
        <h1 className="text-motorsoline-text text-3xl font-semibold mb-8">
          {editingCar ? t('listing.editListingTitle') : t('listing.createListing')}
        </h1>
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
                label={t('modelDetails.title')}
                placeholder={t('model.title')}
                isSelect
                value={formData.vehicleType}
                onChange={(value) => handleInputChange("vehicleType", value)}
                options={[
                  {
                    value: "",
                    label: t('common.select'),
                  },
                  {
                    value: "sõiduauto",
                    label: t('vehicleTypes.passengerCar'),
                  },
                  {
                    value: "maastur",
                    label: t('vehicleTypes.suv'),
                  },
                  {
                    value: "kaubik",
                    label: t('vehicleTypes.van'),
                  },
                  {
                    value: "buss",
                    label: t('vehicleTypes.bus'),
                  },
                  {
                    value: "veoauto",
                    label: t('vehicleTypes.truck'),
                  },
                  {
                    value: "haagis",
                    label: t('vehicleTypes.trailer'),
                  },
                  {
                    value: "mototehnika",
                    label: t('vehicleTypes.motorcycle'),
                  },
                  {
                    value: "haagissuvila",
                    label: t('vehicleTypes.caravan'),
                  },
                  {
                    value: "autoelamu",
                    label: t('vehicleTypes.motorhome'),
                  },
                  {
                    value: "veesõiduk",
                    label: t('vehicleTypes.watercraft'),
                  },
                  {
                    value: "ehitustehnika",
                    label: t('vehicleTypes.constructionMachinery'),
                  },
                  {
                    value: "põllumajandustehnika",
                    label: t('vehicleTypes.agriculturalMachinery'),
                  },
                  {
                    value: "metsatehnika",
                    label: t('vehicleTypes.forestryMachinery'),
                  },
                  {
                    value: "kommunaaltehnika",
                    label: t('vehicleTypes.utilityMachinery'),
                  },
                  {
                    value: "võistlussõiduk",
                    label: t('vehicleTypes.competitionVehicle'),
                  },
                  {
                    value: "muu",
                    label: t('vehicleTypes.other'),
                  },
                ]}
              />
              <FormField
                label={t('formLabels.bodyType')}
                placeholder={t('formLabels.bodyType')}
                isSelect
                value={formData.bodyType}
                onChange={(value) => handleInputChange("bodyType", value)}
                options={[
                  {
                    value: "",
                    label: t('common.select'),
                  },
                  {
                    value: "sedaan",
                    label: t('bodyTypes.sedan'),
                  },
                  {
                    value: "luukpara",
                    label: t('bodyTypes.hatchback'),
                  },
                  {
                    value: "universaal",
                    label: t('bodyTypes.wagon'),
                  },
                  {
                    value: "mahtuniversaal",
                    label: t('bodyTypes.mpv'),
                  },
                  {
                    value: "kupee",
                    label: t('bodyTypes.coupe'),
                  },
                  {
                    value: "kabriolett",
                    label: t('bodyTypes.convertible'),
                  },
                  {
                    value: "pikap",
                    label: t('bodyTypes.pickup'),
                  },
                  {
                    value: "limusiin",
                    label: t('bodyTypes.limousine'),
                  },
                ]}
              />
              <FormField
                label={t('formLabels.brand')}
                placeholder={t('common.select')}
                isSelect
                value={formData.brand_id}
                onChange={(value) => handleInputChange("brand_id", value)}
                options={[
                  { value: "", label: t('common.select') },
                  ...brands.map((b) => ({ value: b.id, label: b.name }))
                ]}
              />
              <FormField
                label={t('formLabels.model')}
                placeholder={t('formLabels.model')}
                isSelect
                value={formData.model_id}
                onChange={(value) => handleInputChange("model_id", value)}
                options={[
                  { value: "", label: t('common.select') },
                  ...models.map((m) => ({ value: m.id, label: m.name }))
                ]}
                className={formData.brand_id}
                disabled={modelLoading}
              />
              <FormField
                label={t('formLabels.otherModelOrSpecification')}
                placeholder={t('formLabels.exampleLong4Matic')}
                value={formData.modelDetail}
                onChange={(value) => handleInputChange("modelDetail", value)}
              />
              <FormField
                label={t('formLabels.higherValueEquipment')}
                placeholder=""
                value={formData.major}
                onChange={(value) => handleInputChange("major", value)}
              />

              <FormField
                label={t('formLabels.firstRegistration')}
                placeholder={t('formLabels.year')}
                isSelect
                value={formData.year_id}
                onChange={(value) => handleInputChange("year_id", value)}
                options={[
                  { value: "", label: "Aasta" },
                  ...years.map((y) => ({ value: y.id, label: y.value }))
                ]}
              />
              <FormField
                label=""
                className="space-y-3 mt-7"
                placeholder={t('formLabels.month')}
                isSelect
                value={formData.month}
                onChange={(value) => handleInputChange("month", value)}
                options={[
                  { value: "", label: "Kuu" },
                  { value: "1", label: "1" },
                  { value: "2", label: "2" },
                  { value: "3", label: "3" },
                  { value: "4", label: "4" },
                  { value: "5", label: "5" },
                  { value: "6", label: "6" },
                  { value: "7", label: "7" },
                  { value: "8", label: "8" },
                  { value: "9", label: "9" },
                  { value: "10", label: "10" },
                  { value: "11", label: "11" },
                  { value: "12", label: "12" },
                ]}
              />
              <FormField
                label={t('formLabels.ownerCountLabel')}
                placeholder="1"
                isSelect
                value={formData.ownerCount}
                onChange={(value) => handleInputChange("ownerCount", value)}
                options={[
                  {
                    value: "",
                    label: t('common.select'),
                  },
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
                label={t('formLabels.vehicleCondition')}
                placeholder={t('formLabels.vehicleCondition')}
                value={formData.technicalData}
                isSelect
                onChange={(value) => handleInputChange("technicalData", value)}
                options={[
                  {
                    value: "",
                    label: t('common.select'),
                  },
                  {
                    value: "uus",
                    label: t('vehicleCondition.new'),
                  },
                  {
                    value: "kasutatud",
                    label: t('vehicleCondition.used'),
                  },
                  {
                    value: "avariiline",
                    label: t('vehicleCondition.damaged'),
                  },
                ]}
              />
              <FormField
                label={t('formLabels.mileage')}
                placeholder={t('formLabels.mileage')}
                value={formData.mileage}
                onChange={(value) => handleInputChange("mileage", value)}
              />
            </div>

          </FormSection>
          {/* Technical Details */}
          <FormSection title="" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FormField
                label={t('formLabels.fuelType')}
                placeholder={t('formLabels.chooseFuelType')}
                isSelect
                value={formData.fuelType}
                onChange={(value) => handleInputChange("fuelType", value)}
                options={[
                  {
                    value: "",
                    label: t('common.select'),
                  },
                  {
                    value: "bensiin",
                    label: t('fuelTypes.gasoline'),
                  },
                  {
                    value: "diisel",
                    label: t('fuelTypes.diesel'),
                  },
                  {
                    value: "elekter",
                    label: t('fuelTypes.electric'),
                  },
                  {
                    value: "bensiin + gaas (LPG/Vedelgaas)",
                    label: t('fuelTypes.gasolineLPG'),
                  },
                  {
                    value: "bensiin + gaas (LNG/veeldatud maagaas)",
                    label: t('fuelTypes.gasolineLNG'),
                  },
                  {
                    value: "bensiin + gaas (CNG/surugaas)",
                    label: t('fuelTypes.gasolineCNG'),
                  },
                  {
                    value: "diisel + gaas (LNG/veeldatud maagaas)",
                    label: t('fuelTypes.dieselLNG'),
                  },
                  {
                    value: "gaas (LPG/vedelgaas)",
                    label: t('fuelTypes.gasLPG'),
                  },
                  {
                    value: "gaas (CNG/surugaas)",
                    label: t('fuelTypes.gasCNG'),
                  },
                  {
                    value: "gaas (LNG/veeldatud maagaas)",
                    label: t('fuelTypes.gasLNG'),
                  },
                  {
                    value: "hübriid (ensiin / elekter)",
                    label: t('fuelTypes.hybridGasolineElectric'),
                  },
                  {
                    value: "hübriid (diisel / elekter)",
                    label: t('fuelTypes.hybridDieselElectric'),
                  },
                  {
                    value: "pistikhübriid (bensiin / elekter)",
                    label: t('fuelTypes.plugInHybridGasolineElectric'),
                  },
                  {
                    value: "pistikhübriid (diisel / elekter)",
                    label: t('fuelTypes.plugInHybridDieselElectric'),
                  },
                  {
                    value: "vesinik",
                    label: t('fuelTypes.hydrogen'),
                  },
                ]}
              />
              <div>
                <FormField
                  label={t('formLabels.transmissionType')}
                  placeholder={t('formLabels.transmissionType')}
                  isSelect
                  value={formData.transmission}
                  onChange={(value) => handleInputChange("transmission", value)}
                  options={[
                    {
                      value: "",
                      label: t('common.select'),
                    },
                    {
                      value: "manuaal",
                      label: t('transmissionTypes.manual'),
                    },
                    {
                      value: "automaat",
                      label: t('transmissionTypes.automatic'),
                    },
                    {
                      value: "pool automaat",
                      label: t('transmissionTypes.semiAutomatic'),
                    },
                  ]}
                />
              </div>
              <FormField
                label={t('formLabels.driveType')}
                placeholder={t('formLabels.driveType')}
                isSelect
                value={formData.drive_type_id}
                onChange={(value) => handleInputChange("drive_type_id", value)}
                options={[
                  {
                    value: "",
                    label: t('common.select'),
                  },
                  {
                    value: "13",
                    label: t('driveTypes.frontWheel'),
                  },
                  {
                    value: "14",
                    label: t('driveTypes.rearWheel'),
                  },
                  {
                    value: "15",
                    label: t('driveTypes.allWheel'),
                  },
                ]}
              />
              <div className="space-y-3"></div>
              {/* <div className="w-full flex items-center gap-4">
                <div className="flex-1">
                  <FormField
                    label="Min istmed"
                    placeholder="0"
                    value={formData.seatsMin}
                    onChange={(value) => handleInputChange("seatsMin", value)}
                  />
                </div>
                <span className="flex items-center text-gray-500 font-medium mt-8">-</span>
                <div className="flex-1">
                  <FormField
                    label="Max istmed"
                    placeholder="0"
                    value={formData.seatsMax}
                    onChange={(value) => handleInputChange("seatsMax", value)}
                  />
                </div>
              </div>
              <div className="w-full flex items-center gap-4">
                <div className="flex-1">
                  <FormField
                    label="Min istmed"
                    placeholder="0"
                    value={formData.seatsMin}
                    onChange={(value) => handleInputChange("seatsMin", value)}
                  />
                </div>
                <span className="flex items-center text-gray-500 font-medium mt-8">-</span>
                <div className="flex-1">
                  <FormField
                    label="Max istmed"
                    placeholder="0"
                    value={formData.seatsMax}
                    onChange={(value) => handleInputChange("seatsMax", value)}
                  />
                </div>
              </div>
              </div> */}
              <FormField
                label={t('formLabels.powerKw2')}
                placeholder="0"
                value={formData.power}
                onChange={(value) => handleInputChange("power", value)}
              />
              <FormField
                label={t('formLabels.displacement')}
                placeholder="0"
                value={formData.displacement}
                onChange={(value) => handleInputChange("displacement", value)}
              />
              <FormField
                label={t('formLabels.seats')}
                placeholder="0"
                value={formData.seats}
                onChange={(value) => handleInputChange("seats", value)}
              />
              <FormField
                label={t('formLabels.doors')}
                placeholder="0"
                value={formData.doors}
                onChange={(value) => handleInputChange("doors", value)}
              />
              <div className="space-y-3">
                <FormField
                  label={t('formLabels.categoryDesignation')}
                  placeholder={t('formLabels.chooseCategoryDesignation')}
                  isSelect
                  value={formData.category}
                  onChange={(value) => handleInputChange("category", value)}
                  options={[
                    {
                      value: "",
                      label: t('common.select'),
                    },
                    {
                      value: "M1",
                      label: "M1",
                    },
                    {
                      value: "M2",
                      label: "M2",
                    },
                    {
                      value: "M3",
                      label: "M3",
                    },
                    {
                      value: "N1",
                      label: "N1",
                    },
                    {
                      value: "N2",
                      label: "N2",
                    },
                    {
                      value: "N3",
                      label: "N3",
                    },
                    {
                      value: "L1e",
                      label: "L1e",
                    },
                    {
                      value: "L2e",
                      label: "L2e",
                    },
                    {
                      value: "L3e",
                      label: "L3e",
                    },
                    {
                      value: "L4e",
                      label: "L4e",
                    },
                    {
                      value: "L5e",
                      label: "L5e",
                    },
                    {
                      value: "L6e",
                      label: "L6e",
                    },
                    {
                      value: "L7e",
                      label: "L7e",
                    },
                    {
                      value: "O1",
                      label: "O1",
                    },
                    {
                      value: "O2",
                      label: "O2",
                    },
                    {
                      value: "O3",
                      label: "O3",
                    },
                    {
                      value: "O4",
                      label: "O4",
                    },
                  ]}
                />
                {formData.category && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      {(() => {
                        const descriptions: { [key: string]: string } = {
                          "M1": t('vehicleCategories.m1'),
                          "M2": t('vehicleCategories.m2'),
                          "M3": t('vehicleCategories.m3'),
                          "N1": t('vehicleCategories.n1'),
                          "N2": t('vehicleCategories.n2'),
                          "N3": t('vehicleCategories.n3'),
                          "L1e": "Kergetsiklid (≤ 50 cm³ ja ≤ 45 km/h)",
                          "L2e": "Kolmerattalised kergetsiklid",
                          "L3e": "Mootorrattad",
                          "L4e": "Mootorrattad külgkorviga",
                          "L5e": "Kolmerattalised mootorsõidukid",
                          "L6e": "Kerge neljarattaline (≤ 45 km/h ja ≤ 425 kg)",
                          "L7e": "Raske neljarattaline (> 45 km/h või > 425 kg)",
                          "O1": "Kerghaagised, ≤ 0,75 t",
                          "O2": "Haagised, 0,75–3,5 t",
                          "O3": "Haagised, 3,5–10 t",
                          "O4": "Haagised, > 10 t"
                        };
                        return descriptions[formData.category] || "";
                      })()}
                    </p>
                  </div>
                )}
              </div>
              <FormField
                label={t('formLabels.vehicleColor')}
                placeholder={t('formLabels.chooseVehicleColor')}
                isSelect
                value={formData.carColor}
                onChange={(value) => handleInputChange("carColor", value)}
                options={[
                  { value: "", label: t('common.select') },
                  ...carColorOptions(t)
                ]}
              />
              <FormField
                label={t('formLabels.colorType')}
                placeholder={t('formLabels.chooseColorType')}
                isSelect
                value={formData.carColorType}
                onChange={(value) => handleInputChange("carColorType", value)}
                options={[
                  { value: "", label: t('common.select') },
                  { value: "tavaline", label: t('colors.normal') },
                  { value: "metallik", label: t('colors.metallic') },
                ]}
              />
              <FormField
                label={t('formLabels.interiorColor')}
                placeholder={t('formLabels.chooseInteriorColor')}
                isSelect
                value={formData.salonColor}
                onChange={(value) => handleInputChange("salonColor", value)}
                options={[
                  { value: "", label: t('common.select') },
                  ...salonColorOptions(t)
                ]}
              />
              <div className="space-y-2">
                <FormField
                  label={t('search.price')}
                  placeholder="€"
                  value={formData.price}
                  onChange={(value) => handleInputChange("price", value)}
                />
              </div>
              <FormField
                label={t('formLabels.discountPrice')}
                placeholder="€"
                value={formData.discountPrice}
                onChange={(value) => handleInputChange("discountPrice", value)}
              />

              <FormField
                label={t('formLabels.vatRefundability')}
                placeholder="Yes"
                isSelect
                value={formData.vatRefundable}
                onChange={(value) => handleInputChange("vatRefundable", value)}
                options={[
                  {
                    value: "",
                    label: t('common.select'),
                  },
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
                label={t('formLabels.vatRate')}
                placeholder=""
                type="number"
                value={formData.vatRate}
                onChange={(value) => handleInputChange("vatRate", value)}
                min={1}
                max={30}
                suffix="%"
                step={1}
              />
              <div className="space-y-3 mt-3">
                <FormField
                  label={t('formLabels.warranty')}
                  placeholder={t('formLabels.validUntil')}
                  value={formData.warranty}
                  onChange={(value) => handleInputChange("warranty", value)}
                />
                <FormField
                  label={t('formLabels.vinCode')}
                  placeholder={t('formLabels.vinCodePlaceholder')}
                  value={formData.vinCode}
                  onChange={(value) => handleInputChange("vinCode", value)}
                />
              </div>
              <div className="ml-2 space-y-3 pt-1 mt-3">
                <div className="flex items-center gap-2">
                  <CheckboxField
                    label={t('formLabels.inspectionValid')}
                    checked={checktechboxes.inspectionValid}
                    onChange={(checked) =>
                      handleCheckTechboxChange("inspectionValid", checked)
                    }
                    className="mt-4"
                  />
                  <div className="flex-1 items-center ml-7">
                    <FormField
                      label=""
                      placeholder="otsi"
                      isSelect
                      value={formData.inspectionValidityPeriod}
                      onChange={(value) => handleInputChange("inspectionValidityPeriod", value)}
                      options={inspectionValidityOptions}
                      disabled={!checktechboxes.inspectionValid}
                    />
                  </div>
                </div>
                <CheckboxField
                  label={t('inspection.technicalInspectionPerformed')}
                  checked={checktechboxes.technicalInspection}
                  onChange={(checked) =>
                    handleCheckTechboxChange("technicalInspection", checked)
                  }
                />
                <CheckboxField
                  label={t('formLabels.technicalMaintenance')}
                  checked={checktechboxes.technicalMaintenance}
                  onChange={(checked) =>
                    handleCheckTechboxChange("technicalMaintenance", checked)
                  }
                />
                <CheckboxField
                  label={t('formLabels.serviceBook')}
                  checked={checktechboxes.serviceBook}
                  onChange={(checked) =>
                    handleCheckTechboxChange("serviceBook", checked)
                  }
                />
                <CheckboxField
                  label={t('formLabels.hideVin')}
                  checked={checktechboxes.hideVin}
                  onChange={(checked) =>
                    handleCheckTechboxChange("hideVin", checked)
                  }
                />

              </div>
              <div className="mt-0">
                <FormField
                  label={t('formLabels.vehicleNumber')}
                  placeholder={t('formLabels.plateNumberPlaceholder')}
                  value={formData.plateNumber}
                  onChange={(value) => handleInputChange("plateNumber", value)}
                />
              </div>
            </div>
          </FormSection>
          {/* Equipment Section */}
          <FormSection title={t('formLabels.higherValueAccessories')}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First 12 checkboxes - always visible */}
              {accessoriesOptions(t).slice(0, 12).map((option) => (
                <div key={option.key} className="flex items-center gap-2">
                  <CheckboxField
                    label={option.label}
                    checked={checkboxes[option.key as keyof typeof checkboxes]}
                    onChange={(checked) => handleCheckboxChange(option.key, checked)}
                  />
                </div>
              ))}

              {/* Additional 41 checkboxes - shown when expanded */}
              {showMoreEquipment && (
                <>
                  {accessoriesOptions(t).slice(12).map((option) => (
                    <div key={option.key} className="flex items-center gap-2">
                      <CheckboxField
                        label={option.label}
                        checked={checkboxes[option.key as keyof typeof checkboxes]}
                        onChange={(checked) => handleCheckboxChange(option.key, checked)}
                      />
                      {option.key === 'stereo' && (
                        <input
                          type="text"
                          placeholder={t('formLabels.exampleBurmeister')}
                          value={formData.stereo}
                          onChange={(e) => handleInputChange("stereo", e.target.value)}
                          className="flex-1 ml-5 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={!checkboxes['stereo' as keyof typeof checkboxes]}
                        />
                      )}
                      {option.key === 'valuveljed' && (
                        <input
                          type="text"
                          placeholder={t('formLabels.measurement')}
                          value={formData.valuveljed}
                          onChange={(e) => handleInputChange("valuveljed", e.target.value)}
                          className="flex-1 ml-5 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={!checkboxes['valuveljed' as keyof typeof checkboxes]}
                        />
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={() => setShowMoreEquipment(!showMoreEquipment)}
                className="flex items-center gap-2 px-5 py-3 border border-[#06d6a0] text-[#06d6a0] rounded-lg text-motorsoline-primary hover:bg-motorsoline-primary hover:text-white transition-colors"
              >
                <span>{showMoreEquipment ? t('formLabels.showLess') : t('formLabels.showMore')}</span>
                <ChevronDownIcon className={`transition-transform ${showMoreEquipment ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </FormSection>
          {/* Equipment Section */}
          <FormSection title="">
            <TextAreaField
              label={t('formLabels.equipment')}
              placeholder={t('formLabels.equipment')}
              value={formData.equipment}
              onChange={(value) => handleInputChange("equipment", value)}
            />
          </FormSection>

          {/* Description Section */}
          <FormSection title="">
            <TextAreaField
              label={t('formLabels.vehicleDescriptionBySeller')}
              placeholder={t('formLabels.vehicleDescriptionBySeller')}
              value={formData.description}
              onChange={(value) => handleInputChange("description", value)}
            />
          </FormSection>

          {/* Contact Section */}
          <FormSection title={t('common.contact')}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="w-full">
                  <label className="block text-motorsoline-text text-lg font-medium mb-3">
                    {t('formLabels.country')}
                  </label>
                  <ReactFlagsSelect
                    selected={contactFormData.country}
                    onSelect={(value) => handleContactInputChange("country", value)}
                    placeholder={t('formLabels.country')}
                    searchable={true}
                    className="w-full"
                  />
                </div>
              </div>
              <FormField
                label={t('formLabels.phoneNumber')}
                placeholder="+372 1234 567"
                value={contactFormData.phone}
                onChange={(value) => handleContactInputChange("phone", value)}
              />
              <FormField
                label={t('formLabels.socialNetwork')}
                placeholder={t('formLabels.exampleYoutube')}
                value={contactFormData.socialNetwork}
                onChange={(value) => handleContactInputChange("socialNetwork", value)}
              />
              <FormField
                label={user?.userType === "company" ? t('formLabels.company') : t('formLabels.individual')}
                placeholder={user?.userType === "company" ? t('formLabels.enterCompany') : t('formLabels.enterIndividual')}
                value={contactFormData.businessType}
                onChange={(value) => handleContactInputChange("businessType", value)}
              />
              <FormField
                label={t('auth.email')}
                placeholder={t('formLabels.exampleEmail')}
                type="email"
                value={contactFormData.email}
                onChange={(value) => handleContactInputChange("email", value)}
              />
              <FormField
                label={t('formLabels.address')}
                placeholder={t('formLabels.address')}
                value={contactFormData.address}
                onChange={(value) => handleContactInputChange("address", value)}
              />
              <FormField
                label={t('formLabels.website')}
                placeholder={t('formLabels.website')}
                value={contactFormData.website}
                onChange={(value) => handleContactInputChange("website", value)}
              />
              {/* <FormField
                label="Suhtluskeel"
                placeholder="Suhtluskeel"
                value={formData.language}
                onChange={(value) => handleInputChange("language", value)}
              /> */}
              <div className="w-full mt-0">
                <label className="block text-motorsoline-text text-lg font-medium mb-3">
                  {t('formLabels.communicationLanguage')}
                </label>
                {/* <ReactLanguageSelect
                    className="w-full rounded-lg bg-white text-lg"
                    selected={formData.language}
                    onSelect={(value) => handleInputChange("language", value)}
                    placeholder="Valige keel"
                    searchable={true}
                  /> */}
                <MultiLanguageSelect
                  selected={contactFormData.language}
                  onSelect={handleLanguageChange}
                  placeholder={t('language.selectLanguages')}
                  searchable={true}
                  className="w-[530px]"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-4 items-center">
              <button className="flex items-center px-8 py-4 border border-brand-primary rounded-lg text-brand-primary hover:bg-motorsoline-primary hover:text-white transition-colors">
                + {t('formLabels.socialNetwork')}
              </button>
              <button
                onClick={handleSaveContact}
                className={`flex items-center px-4 py-4 rounded-lg text-white transition-colors ${contactSaved
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-brand-primary hover:bg-motorsoline-primary'
                  }`}
              >
                {contactSaved ? '✓ ' + t('common.success') : t('formLabels.saveContacts')}
              </button>
              {/* {contactSaved && (
                <span className="text-green-600 text-sm font-medium">
                  {editingCar ? 'Kontaktandmed on salvestatud andmebaasi' : 'Kontaktandmed on ajutiselt salvestatud'}
                </span>
              )} */}
              {/* <button 
                onClick={handleDeleteContact}
                className={`flex items-center px-8 py-4 rounded-lg text-white transition-colors bg-red-500 hover:bg-red-600 
                }`}
              >
                Lähtesta kontakt
              </button> */}
            </div>

          </FormSection>

          {/* Additional Info Section */}
          <FormSection title="">
            <TextAreaField
              label={t('car.description')}
              placeholder={t('car.description')}
              value={formData.additionalInfo}
              onChange={(value) => handleInputChange("additionalInfo", value)}
            />
          </FormSection>

          <FormSection title="">
            <div className="space-y-4">
              <div className="flex gap-2">
                {editingCar ? (
                  <>
                    <button
                      type="button"
                      className="bg-brand-primary text-white px-4 py-2 rounded font-semibold hover:bg-blue-600 transition-colors"
                      onClick={handleCarSubmit}
                      disabled={carLoading}
                    >
                      {carLoading ? t('common.saving') : t('common.saveChanges')}
                    </button>
                    <button
                      type="button"
                      className="bg-gray-300 px-4 py-2 rounded font-semibold hover:bg-gray-400 transition-colors"
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
                          vatRate: "",
                          accident: "",
                          vinCode: "",
                          carColor: "",
                          carColorType: "",
                          salonColor: "",
                          description: "",
                          equipment: "",
                          additionalInfo: "",
                          stereo: "",
                          valuveljed: "",
                          inspectionValidityPeriod: "",
                          seats: "",
                          doors: "",
                          major: "",
                        });
                        setContactFormData({
                          phone: "",
                          businessType: "",
                          socialNetwork: "",
                          email: "",
                          address: "",
                          website: "",
                          language: [],
                          country: "",
                        });
                        setCarImages(Array(40).fill(null));
                        setShowMorePhotos(false);
                        setStereoInput("");
                        navigate(`/${currentLanguage}/user`);
                      }}
                    >
                      {t('common.cancel')}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="bg-brand-primary text-white px-4 py-2 rounded font-semibold hover:bg-blue-600 transition-colors"
                    onClick={() => setIsModalOpen(true)}
                  >
                    {t('common.preview')}
                  </button>
                )}
              </div>
            </div>
          </FormSection>
        </div>

        {/* Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-[100vw] max-h-[100vh] w-screen h-screen p-0 m-0 rounded-none flex flex-col">
            <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
              <DialogTitle>{t('common.preview')}</DialogTitle>
              <DialogDescription>
                Auto eelvaade - näete, kuidas teie kuulutus välja näeb
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              {!editingCar ? (
                <CarPreview
                  formData={formData}
                  checkboxes={checkboxes}
                  brands={brands}
                  models={models}
                  contactFormData={contactFormData}
                  years={years}
                  driveTypes={driveTypes}
                  carImages={carImages}
                />
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">
                    {t('car.saveDataBeforePreview')}
                  </p>
                </div>
              )}
            </div>
            <DialogFooter className="px-6 py-4 border-t flex-shrink-0">
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded font-semibold hover:bg-gray-400 transition-colors"
                  onClick={() => setIsModalOpen(false)}
                >
                  {t('common.close')}
                </button>
                <button
                  type="button"
                  className="bg-brand-primary text-white px-4 py-2 rounded font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={carLoading}
                  onClick={handleCarSubmit}
                >
                  {carLoading ? t('common.saving') : (editingCar ? t('common.saveChanges') : t('common.addListing'))}
                </button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </PageContainer>
  );
}

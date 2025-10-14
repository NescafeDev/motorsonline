import { ChevronDownIcon, HeartIcon } from "lucide-react";
import React from "react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { SpecificationsSection } from "./sections/SpecificationsSection";
import CarGallery from "../../components/mobile/CarGallery";
import { ImageGallerySection } from "./sections/ImageGallerySection";
import { useAuth } from "../../contexts/AuthContext";
import { useI18n } from "../../contexts/I18nContext";

interface CarMobilePreviewProps {
    formData: any;
    contactFormData: any;
    checkboxes: any;
    brands: { id: number; name: string }[];
    models: { id: number; name: string }[];
    years: { id: number; value: string }[];
    driveTypes: { id: number; name: string; ee_name: string }[];
    carImages: (File | null)[];
}

export default function CarMobilePreview({ formData, contactFormData, checkboxes, brands, models, years, driveTypes, carImages }: CarMobilePreviewProps) {
    const { user } = useAuth();
    const { t } = useI18n();
    
    // Function to get VAT display text
    const getVatDisplayText = (car: any) => {
        if (!car) return '';

        // If there's no VAT rate or it's empty/null, show "Hind ei sisalda käibemaksu"
        if (car.vatRefundable === 'no' || car.vatRefundable === 'ei') {
            return 'KM 0% (käibemaksu ei lisandu)';
        }

        // If VAT rate is 24, show "Hind sisaldab käibemaksu 24%"
        return 'Hind sisaldab käibemaksu ' + car.vatRate + '%';
    };

    // Map form data to car data format
    const getCarData = () => {
        const selectedBrand = brands.find(b => b.id.toString() === formData.brand_id);
        const selectedModel = models.find(m => m.id.toString() === formData.model_id);
        const selectedYear = years.find(y => y.id.toString() === formData.year_id);
        const selectedDriveType = driveTypes.find(d => d.id.toString() === formData.drive_type_id);
        return {
            id: 0, // Preview mode
            brand_name: selectedBrand?.name || '',
            model_name: selectedModel?.name || '',
            year_value: selectedYear?.value ? parseInt(selectedYear.value) : 0,
            month: formData.month || '',
            mileage: parseInt(formData.mileage) || 0,
            modelDetail: formData.modelDetail || '',
            power: formData.power || '',
            transmission: formData.transmission || '',
            fuelType: formData.fuelType || '',
            drive_type_id: formData.drive_type_id || '',
            drive_type_ee_name: selectedDriveType?.ee_name || '',
            ownerCount: formData.ownerCount || '',
            displacement: formData.displacement || '',
            technicalData: formData.technicalData || '',
            category: formData.category || '',
            plateNumber: formData.plateNumber || '',
            price: parseFloat(formData.price) || 0,
            discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
            vatRate: formData.vatRate || '24',
            vatRefundable: formData.vatRefundable || '',
            images: carImages.map((file, idx) => file ? URL.createObjectURL(file) : '').filter(Boolean),
            equipment: formData.equipment || '',
            description: formData.description || '',
            businessType: contactFormData.businessType || '',
            country: contactFormData.country || '',
            phone: contactFormData.phone || '',
            email: contactFormData.email || '',
            language: contactFormData.language || '',
            website: contactFormData.website || '',
            address: contactFormData.address || ''
        };
    };

    const car = getCarData();

    // Prepare car images array
    const carImagesArray = (car.images || []).filter(Boolean) as string[];

    // Vehicle details data
    const vehicleDetails = [
        {
            icon: "/img/car/Car.png",
            label: t('carSpecs.mileage') + ":",
            value: `${car.mileage.toLocaleString()} km`,
        },
        {
            icon: "/img/car/Speedometer.png",
            label: t('carSpecs.power') + ":",
            value: car.power,
        },
        {
            icon: "/img/car/gear-box-switch.png",
            label: t('carSpecs.transmission') + ":",
            value: car.transmission,
        },
        {
            icon: "/img/car/calendar.png",
            label: "Esmaregistreerimine:",
            value: car.year_value?.toString() + " - " + (car.month.length === 1 ? `0${car.month}` : car.month) || "N/A",
        },
        {
            icon: "/img/car/gas_station.png",
            label: t('carSpecs.fuel'),
            value: car.fuelType,
        },
        {
            icon: "/img/car/user_profile.png",
            label: "Omanike arv:",
            value: car.ownerCount,
        },
    ];

    // Technical specifications data
    const technicalSpecs = [
        { label: "Tehnilised andmed", value: car.technicalData },
        { label: t('formLabels.displacement') + ":", value: car.displacement },
        { label: t('formLabels.categoryDesignation') + ":", value: car.category },
        { label: t('carSpecs.power') + ":", value: car.power },
        { label: t('formLabels.vehicleNumber'), value: car.plateNumber },
        { label: t('formLabels.driveType') + ":", value: car.drive_type_ee_name },
        { label: t('carSpecs.mileage') + ":", value: `${car.mileage.toLocaleString()} km` },
        { label: t('formLabels.fuelType') + ":", value: car.fuelType },
    ];

    // Equipment features data - parse from equipment string
    const accessoriesOptions = [
        { key: 'kokkupõrgetennetavpidurisüsteem', label: t('carFeatures.collisionPreventionBrakingSystem') },
        { key: 'pimenurgahoiatus', label: 'Pimenurga Hoiatus' },
        { key: 'sõidurajahoidmiseabisüsteem', label: 'Sõiduraja Hoidmise Abisüsteem' },
        { key: 'sõidurajavahetamiseabisüsteem', label: 'Sõidurajavahetamise Abisüsteem' },
        { key: 'adaptiivnepüsikiirusehoidja', label: 'Adaptiivne Püsikiirusehoidja' },
        { key: 'liiklusmärkidetuvastusjakuvamine', label: 'Liiklusmärkide Tuvastus ja Kuvamine' },
        { key: 'parkimisandurideesjataga', label: 'Parkimisandurid Ees ja Taga' },
        { key: 'parkimiskaamera', label: 'Parkimiskaamera' },
        { key: 'parkimiskaamera360', label: 'Parkimiskaamera 360°' },
        { key: 'kaugtuledeümberlülitamiseassistent', label: 'Kaugtulede ümberlülitamise Assistent' },
        { key: 'LEDesituled', label: 'LED Esituled' },
        { key: 'Xenonesituled', label: 'Xenon Esituled' },
        { key: 'lasersituled', label: 'Laser Esituled' },
        { key: 'elektriliseoojendusegaesiklaas', label: 'Elektrilise Soojendusega Esiklaas' },
        { key: 'kliimaseade', label: 'Kliimaseade' },
        { key: 'salongieelsoojendus', label: 'SalongiEelsoojendus' },
        { key: 'mootorieelsoojendus', label: 'MootoriEelsoojendus' },
        { key: 'salongilisaoojendus', label: 'Salongi Lisasoojendus' },
        { key: 'istmesoojendused', label: 'Istmesoojendused' },
        { key: 'elektriliseltreguleeritavadIstmed', label: 'Elektriliselt Reguleeritavad Istmed' },
        { key: 'comfortistmed', label: 'Comfort Istmed' },
        { key: 'sportistmed', label: 'Sport Istmed' },
        { key: 'nahkpolster', label: 'Nahkpolster' },
        { key: 'poolnahkpolster', label: 'Poolnahkpolster' },
        { key: 'tagaistmeseljatugiallaklapitav', label: 'Tagaistme Seljatugi Allaklapitav' },
        { key: 'eraldikliimaseadetagaistmetele', label: 'Eraldi Kliimaseade Tagaistmetele' },
        { key: 'võtmetavamine', label: 'Võtmeta Avamine' },
        { key: 'võtmetaäivitus', label: 'Võtmeta Käivitus' },
        { key: 'pakiruumiavaminejasulgeminelektriliselt', label: 'Pakiruumi Avamine ja Sulgemine Elektriliselt' },
        { key: 'soojendusegarool', label: 'Soojendusega Rool' },
        { key: 'ventileeritavadstmed', label: 'Ventileeritavad Istmed' },
        { key: 'massaažifunktsioonigaiistmed', label: 'Massaažifunktsiooniga Istmed' },
        { key: 'infokuvamineesiklaasile', label: 'Info Kuvamine Esiklaasile' },
        { key: 'panoraamkatusklaasist', label: 'Panoraamkatus (klaasist)' },
        { key: 'katuseluuk', label: 'Katuseluuk' },
        { key: 'usteservosulgurid', label: 'Uste Servosulgurid' },
        { key: 'topeltklaasid', label: 'Topeltklaasid' },
        { key: 'rulookardinadustel', label: 'Rulookardinad Ustel' },
        { key: 'integreeritudVäravapult', label: 'Integreeritud Väravapult' },
        { key: 'AppleCarPlay', label: 'Apple CarPlay' },
        { key: 'AndroidAuto', label: 'Android Auto' },
        { key: 'stereo', label: 'Stereo' },
        { key: 'õhkvedrustus', label: 'Õhkvedrustus' },
        { key: 'reguleeritavvedrustus', label: 'Reguleeritav Vedrustus' },
        { key: '4-rattapööramine', label: '4-ratta Pööramine' },
        { key: 'veokonks', label: 'Veokonks' },
        { key: 'elektrilisedliuguksed', label: 'Elektrilised Liuguksed' },
        { key: 'öiseNägemiseassistent', label: 'Öise Nägemise Assistent' },
        { key: 'valgustuspakett', label: 'Valgustuspakett' },
        { key: 'suverehvid', label: 'Suverehvid' },
        { key: 'talverehvid', label: 'Talverehvid' },
        { key: 'valuveljed', label: 'Valuveljed' },
    ];

    const equipmentFeatures = checkboxes
        ? accessoriesOptions
            .filter(option => checkboxes[option.key])
            .map(option => ({
                label: option.label,
                icon: "/img/car/check.svg"
            }))
        : [];

    // Calculate discount percentage
    const discountPercentage = car.discountPrice && car.price
        ? Math.round(((car.price - car.discountPrice) / car.price) * 100)
        : 0;

    return (
        <div className="bg-white w-full min-h-screen">
            {/* Mobile-optimized layout */}
            <div className="px-4 py-6 space-y-6">
                {/* Main car image */}
                <div className="w-full">
                    {/* <img
                        src={carImagesArray[0] || "/img/placeholder.png"}
                        alt={`${car.brand_name} ${car.model_name}`}
                        className="w-full h-64 object-cover rounded-lg"
                    /> */}
                    <CarGallery
                        mainImage={carImagesArray[0] || "/img/placeholder.png"}
                        thumbnails={carImagesArray}
                        totalImages={carImagesArray.length}
                        onImageClick={(index) => {
                            console.log('Image clicked:', index);
                        }}
                    >
                        {/* {carImagesArray.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`${car.brand_name} ${car.model_name} - ${index + 1}`}
                            />
                        ))} */}
                    </CarGallery>
                </div>

                {/* Car title and price */}
                <Card className="bg-[#f6f7f9] rounded-[10px] border-none">
                    <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                            <h1 className="text-2xl font-semibold text-secondary-500 tracking-[-0.8px] leading-[32px] flex-1 pr-2">
                                {car.brand_name} {car.model_name} {car.modelDetail}
                            </h1>
                            <Button
                                variant="ghost"
                                className="p-2 flex-shrink-0"
                            >
                                <HeartIcon
                                    className="w-6 h-6 text-gray-400 hover:text-red-400"
                                />
                            </Button>
                        </div>

                        <div className="mb-4">
                            <span className="text-[#747474] text-sm tracking-[0.2px] leading-[20px] font-medium">
                                Kasutatud autod » {car.brand_name} {car.model_name} » {car.year_value}
                            </span>
                        </div>
                        {/* Vehicle details */}
                        <Card className="bg-[#f6f7f9] rounded-[10px] border-none">
                            <CardContent className="p-4">
                                <h2 className="font-semibold text-secondary-500 text-lg tracking-[-0.4px] leading-[24px] mb-4">
                                    Tehnilised andmed
                                </h2>

                                <div className="grid grid-cols-2 gap-3">
                                    {vehicleDetails.map((detail, index) => (
                                        <div key={index} className="flex items-center bg-white rounded-lg p-3">
                                            <div className="w-12 h-12 relative flex-shrink-0">
                                                <img
                                                    className="w-8 h-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                                                    alt={detail.label}
                                                    src={detail.icon}
                                                />
                                            </div>
                                            <div className="flex flex-col min-w-0 flex-1 ml-2">
                                                <span className="font-normal text-secondary-500 text-xs tracking-[-0.2px] leading-[16px] break-words">
                                                    {detail.label}
                                                </span>
                                                <span className="font-medium text-secondary-500 text-sm tracking-[-0.3px] leading-[20px] break-words">
                                                    {detail.value}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                        {/* Price section */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    {car.discountPrice && (
                                        <>
                                            <div className="relative">
                                                <span className="font-medium text-[#747474] text-sm leading-[20px]">
                                                    € {car.price.toLocaleString()}
                                                </span>
                                                <Separator className="absolute w-[40px] top-[10px] -left-1 bg-gray-400" />
                                            </div>
                                            {discountPercentage != 0 && (
                                                <Badge className="bg-[#ffe5e5] text-[#ff0000] border border-[#ff0000] rounded-[100px] px-2 py-1 text-xs">
                                                    {discountPercentage}%
                                                </Badge>
                                            )}
                                        </>
                                    )}
                                </div>
                                <div className="mt-1">
                                    <span className="font-semibold text-secondary-500 text-2xl leading-[32px]">
                                        € {(car.discountPrice || car.price).toLocaleString()}
                                    </span>
                                    <p className="text-[#747474] text-xs tracking-[-0.2px] leading-[16px] mt-1 text-center">
                                        {getVatDisplayText(car)}
                                    </p>
                                </div>
                            </div>
                            <div className="ml-4 mt-7">
                                <Button
                                    className="bg-[#06d6a0] text-white rounded-[10px] px-6 py-3 text-sm"
                                >
                                    {t('formLabels.sendEmail')}
                                </Button>

                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Technical specifications */}
                <Card className="bg-[#f6f7f9] rounded-[10px] border-none">
                    <CardContent className="p-4">
                        <h2 className="font-semibold text-secondary-500 text-lg tracking-[-0.4px] leading-[24px] mb-4">
                            {t('formLabels.technicalSpecs')}
                        </h2>

                        <div className="space-y-3">
                            {technicalSpecs.map((spec, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-[10px] p-3 flex justify-between items-center"
                                >
                                    <span className="font-medium text-secondary-500 text-sm tracking-[-0.3px] leading-[20px] flex-1">
                                        {spec.label}
                                    </span>
                                    <span className="font-normal text-secondary-500 text-sm tracking-[-0.3px] leading-[20px] ml-2">
                                        {spec.value}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center mt-6">
                            <Button
                                variant="outline"
                                className="border-[#06d6a0] text-[#06d6a0] rounded-[10px] flex items-center gap-2 px-4 py-2"
                            >
                                {t('formLabels.showMore')}
                                <ChevronDownIcon className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Equipment features */}
                {equipmentFeatures.length > 0 && (
                    <Card className="w-full mt-10 bg-[#f6f7f9] rounded-[10px] border-none">
                        <CardContent className="p-5">
                            <h2 className="font-semibold text-secondary-500 text-xl tracking-[-0.60px] leading-[30px] [font-family:'Poppins',Helvetica] mb-6">
                                {t('formLabels.higherValueAccessories')}
                            </h2>

                            <div className="grid grid-cols-1 gap-4">
                                {equipmentFeatures.slice(0, 12).map((feature, index) => (
                                    <div
                                        key={index}
                                        className="bg-white rounded-[10px] p-2.5 flex justify-between items-start gap-2"
                                    >
                                        <span className="font-medium text-secondary-500 text-lg tracking-[-0.54px] leading-[27px] [font-family:'Poppins',Helvetica] break-words flex-1 min-w-0">
                                            {feature.label}
                                        </span>
                                        <div className="w-6 h-6 bg-[100%_100%] flex-shrink-0">
                                            <img className="w-6 h-6 " src={feature.icon} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-center mt-8">
                                <Button
                                    variant="outline"
                                    className="border-[#06d6a0] text-[#06d6a0] rounded-[10px] flex items-center gap-2.5"
                                >
                                    {t('formLabels.showMore')}
                                    <ChevronDownIcon className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <ImageGallerySection car={car} />

                {/* Seller information - using the same component as CarPage.tsx */}
                <SpecificationsSection
                    sellerData={{
                        title: t('formLabels.seller'),
                        company: contactFormData.businessType || "ELKE Mustamäe",
                        address: contactFormData.address || "Tallinn, Mustamäe tee 22",
                        phone: contactFormData.phone || "+372 8888 8888",
                        contactPerson: user?.userType || "Eraisik",
                        email: contactFormData.email || "Näide@elke.ee",
                        language: contactFormData.language || "en",
                        website: contactFormData.website || "example.com",
                        country: contactFormData.country || "EE"
                    }}
                />

                {/* Action buttons */}
                {/* <Card className="bg-[#f6f7f9] rounded-[10px] border-none">
           <CardContent className="p-4">
             <div className="flex flex-col sm:flex-row gap-3 w-full">
               <Button
                 type="button"
                 variant="outline"
                 className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors flex-1 sm:flex-none order-2 sm:order-1"
                 onClick={onClose}
               >
                 Sulge
               </Button>
               {editingCar && (
                 <Button
                   type="button"
                   variant="outline"
                   className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors flex-1 sm:flex-none order-1 sm:order-2"
                   onClick={onCancel}
                 >
                   Tühista
                 </Button>
               )}
               <Button
                 type="button"
                 className="bg-brand-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex-1 sm:flex-none order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
                 disabled={isSubmitting}
                 onClick={onSubmit}
               >
                 {isSubmitting ? "Salvestatakse..." : (editingCar ? "Salvesta muudatused" : "Lisa kuulutus")}
               </Button>
             </div>
           </CardContent>
         </Card> */}
            </div>
        </div>
    );
}

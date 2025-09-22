import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import { Separator } from "../../../../components/ui/separator";

export const ImageGallerySection = (): JSX.Element => {
  // Vehicle description data
  const vehicleDescription = {
    title: `Esitleme Aston Martin DBS Superleggera't – nimetus „DBS", mille juured ulatuvad 1960ndate lõppu, sümboliseerib Aston Martini missiooni luua erakordseid Grand Touring autosid. DBS Superleggera kapoti all asub 725 hj 5,2-liitrine topeltturboga V12 mootor, mis pakub lisaks jõudlusele ka akustiliselt nauditavat elamust.`,
    basicInfo: ["1 omanik, ainult 20 350 km", "Erivärv: Porsche Gulf Blue"],
    equipment: [
      "Välisvärv: Gulf Blue – Porsche (Q Special) (värv)",
      "Salongi viimistlus 1: Obsidian Black nahk (Contemporary) (Caithness Leather)",
      "Õmblused salongis: Vastavuses maailmaga (Match to Welt)",
      "Salongi viimistlus 2: Obsidian Black nahk (Contemporary) (Caithness Leather)",
      "Õmblused salongis 2: Vastavuses maailmaga",
      "Istmete väline osa: Obsidian Black nahk (Contemporary) (Caithness Leather)",
      "Välimised õmblused: Vastavuses maailmaga",
      "Istmete sisemine osa: Pure Black Alcantara (Contemporary) (Alcantara)",
      "Sisemised õmblused: Vastavuses maailmaga",
      "Istmete tepitud aktsent: Puudub",
      "Juhiistme tikand: Vastavuses maailmaga",
      "Dekoorliistud: Obsidian Black nahk (Contemporary) (Caithness Leather)",
      "Laepolster (sisemine): Pure Black Alcantara (nahksisudega) (Primary)",
      "Laepolster (välimine): Pure Black Alcantara (Contemporary)",
      "Vaibavärv: Obsidian Black - 600gsm (Primary)",
      "Vaibaservad: Vastavuses vaibavärviga",
      "Rooli viimistlus: Obsidian Black nahk (Contemporary) (Caithness Leather)",
      "Rooli õmblused: Standard",
      "Helisüsteem: Aston Martin Premium Audio",
      "Kapoti võred: Must võre",
      "Pagasiruumi vaip: Must",
      "Pidurisadulad: Oranžid",
      "Summutiotsad: Roostevaba teras – matt must (quad)",
      "Välimine viimistluspakett: Q Carbon tiivad / Aston Martin kiri",
      "Väliskerepakett: Carbon Fibre splitter ja difuusor",
      "Uksekäepidemed: Värvitud",
      "Sisekonsool (dekoor): 2x2 Carbon Fibre Twill",
      "Poritiiva võre: Must",
      "Esmaabikomplekt: Komplektis",
      "Põrandamatid: Alusmattide komplekt",
      "Esivõre logo: Kinnituspakis",
      "Garaažiukse avaja: Komplektis",
      "Käigukast: Touchtronic 3",
      "Salongi viimistlus: Dark Chrome / Satin Carbon Interior Pack",
      "Peeglikatted: Carbon Fibre Gloss",
      "Katusepaneel: Carbon Fibre",
      "Katuse ääris: Kerevärv",
      "Istmete tagaosa: Ilma spoonita",
      "Turvavööd: Mustad",
      "Istmepolstrid: Elektrilised",
      "Peatoe tikand: Aston Martini tiivad",
      "Istmepadjad: Mitteperforeeritud",
      "Istmetüüp: Sportistmed",
      "Istmekorraldus: 2 + 2",
      "Rool: Sport – Nahk / Alcantara",
      "Tagatuled: Toonitud",
      "GPS jälgimisseade: Aston Martin Tracking",
      "Dekoorsplitt: Ühetooniline",
      "Vihmavari: Komplektis",
      "Mootoriruumi pakett: Standard",
      "Veljekapslid: Värvitud vastavalt veljeviimistlusele",
      "Veljed: Sepistatud Y-kujulised – satiinmusta / läikivmusta viimistlusega",
    ],
    contactInfo: ["WhatsApp: +49 000 00000000", "E-post: Näide@elke.ee"],
    socialMedia: ["Instagramis: @Näide", "Youtubes: www.youtube.com/Näide"],
    financing: [
      "Finantseerimine ja liising alates 2,99%!",
      "Võtame teie praeguse auto tagasi ostul arvesse!",
    ],
    additionalInfo: [
      "Heameelega pakume registreerimisteenust ja sobivat kindlustuspakkumist.",
    ],
    teamInfo: ["Ootame teie külastust!", "TEIE AUTOSL MEESKOND"],
    legalInfo:
      "Internetis esitatud andmed on mittesiduva iseloomuga. Need ei kujuta endast tagatud omadusi. Müüja ei vastuta kirjavigade või andmeedastusvigade eest. Muudatused ja vahemüük on võimalikud. Me jätame endale õiguse parandada andme- ja varustusvigu. Lepingu järgne seisukord on vaid see, mis on enne ostulepingut kohapeal kontrollitud ja kirjalikult kinnitatud.",
  };

  return (
    <section className="w-full max-w-[1240px] mx-auto my-8">
      <Card className="bg-[#f6f7f9] rounded-[10px] p-5">
        <CardContent className="p-0 space-y-8">
          {/* Vehicle description */}
          <div className="space-y-4">
            <h2 className="font-['Poppins',Helvetica] font-semibold text-secondary-500 text-xl tracking-[-0.60px] leading-[30px]">
              Sõiduki kirjeldus müüja poolt
            </h2>
            <p className="font-['Poppins',Helvetica] font-normal text-secondary-500 text-lg tracking-[-0.54px] leading-[27px]">
              {vehicleDescription.title}
            </p>
          </div>
          {/* Car model and basic info */}
          <div className="space-y-4">
            <h2 className="font-['Poppins',Helvetica] font-semibold text-secondary-500 text-xl tracking-[-0.60px] leading-[30px]">
              Aston Martin DBS Superleggera Q
            </h2>
            <div className="font-['Poppins',Helvetica] font-normal text-secondary-500 text-lg tracking-[-0.54px] leading-[27px]">
              {vehicleDescription.basicInfo.map((info, index) => (
                <li key={`basic-info-${index}`}>{info}</li>
              ))}
            </div>
          </div>
          {/* Equipment */}
          <div className="space-y-4">
            <h2 className="font-['Poppins',Helvetica] font-semibold text-secondary-500 text-xl tracking-[-0.60px] leading-[30px]">
              Varustus:
            </h2>
            <div className="font-['Poppins',Helvetica] font-normal text-secondary-500 text-lg tracking-[-0.54px] leading-[27px]">
              {vehicleDescription.equipment.map((item, index) => (
                <li key={`equipment-${index}`}>{item}</li>
              ))}
            </div>
          </div>
          {/* Contact information */}
          <div className="space-y-4">
            <h2 className="font-['Poppins',Helvetica] font-semibold text-secondary-500 text-xl tracking-[-0.60px] leading-[30px]">
              Kui teil on küsimusi või soovite rohkem teada meie sõidukite
              kohta, ärge kõhelge meiega ühendust võtmast. Meie meeskond on teie
              jaoks olemas.
            </h2>
            <div className="font-['Poppins',Helvetica] font-normal text-secondary-500 text-lg tracking-[-0.54px] leading-[27px]">
              {vehicleDescription.contactInfo.map((contact, index) => (
                <li key={`contact-${index}`}>{contact}</li>
              ))}
            </div>
          </div>
          {/* Social media */}
          <div className="space-y-4">
            <h2 className="font-['Poppins',Helvetica] font-semibold text-secondary-500 text-xl tracking-[-0.60px] leading-[30px]">
              Avastage meie eksklusiivsete luksusautode maailm ja olge kursis
              pakkumiste ja uudistega. Jälgige meid:
            </h2>
            <div className="font-['Poppins',Helvetica] font-normal text-secondary-500 text-lg tracking-[-0.54px] leading-[27px]">
              {vehicleDescription.socialMedia.map((social, index) => (
                <li key={`social-${index}`}>{social}</li>
              ))}
            </div>
          </div>
          {/* Financing */}
          <div className="space-y-4">
            <h2 className="font-['Poppins',Helvetica] font-semibold text-secondary-500 text-xl tracking-[-0.60px] leading-[30px]">
              {vehicleDescription.financing.map((finance, index) => (
                <React.Fragment key={`finance-${index}`}>
                  {finance}
                  {index < vehicleDescription.financing.length - 1 && <br />}
                </React.Fragment>
              ))}
            </h2>
          </div>
          {/* Visit information */}
          <div className="space-y-4">
            <h2 className="font-['Poppins',Helvetica] font-semibold text-secondary-500 text-xl tracking-[-0.60px] leading-[30px]">
              Palume enne külastust kindlasti meiega ühendust võtta!
            </h2>
            <div className="font-['Poppins',Helvetica] font-normal text-secondary-500 text-lg tracking-[-0.54px] leading-[27px]">
              {vehicleDescription.additionalInfo.map((info, index) => (
                <p key={`additional-${index}`}>{info}</p>
              ))}
            </div>
          </div>
          {/* Team information */}
          <div className="font-['Poppins',Helvetica] font-semibold text-secondary-500 text-lg tracking-[-0.54px] leading-[27px]">
            {vehicleDescription.teamInfo.map((info, index) => (
              <React.Fragment key={`team-${index}`}>
                {info}
                {index < vehicleDescription.teamInfo.length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>
          {/* Legal information */}
          <div className="space-y-4">
            <h2 className="font-['Poppins',Helvetica] font-semibold text-secondary-500 text-xl tracking-[-0.60px] leading-[30px]">
              Õiguslik teave:
            </h2>
            <p className="font-['Poppins',Helvetica] font-normal text-secondary-500 text-lg tracking-[-0.54px] leading-[27px]">
              {vehicleDescription.legalInfo}
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

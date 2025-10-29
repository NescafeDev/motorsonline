import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Translation mapping for car details from Estonian to other languages
export const translateCarDetail = (value: string, currentLanguage: string): string => {
  if (currentLanguage === 'ee') return value;
  
  const translations: Record<string, Record<string, string>> = {
    // Vehicle condition
    'Kasutatud': { en: 'Used', ru: 'Б/у', de: 'Gebraucht', fi: 'Käytetty', et: 'Kasutatud' },
    'Uus': { en: 'New', ru: 'Новый', de: 'Neu', fi: 'Uusi', et: 'Uus' },
    'Avariiline': { en: 'Very good', ru: 'Очень хорошее', de: 'Sehr gut', fi: 'Erittäin hyvä', et: 'Väga hea' },
    
    //serviceBook
    'jah': { en: 'Yes', ru: 'Да', de: 'Ja', fi: 'Kyllä', et: 'Jah' },
    'ei': { en: 'No', ru: 'Нет', de: 'Nein', fi: 'Ei', et: 'Ei' },
    // Fuel types
    'bensiin': { en: 'Petrol', ru: 'Бензин', de: 'Benzin', fi: 'Bensiini', et: 'Bensiin' },
    'diisel': { en: 'Diesel', ru: 'Дизель', de: 'Diesel', fi: 'Diesel', et: 'Diisel' },
    'elekter': { en: 'Electric', ru: 'Электрический', de: 'Elektrisch', fi: 'Sähkö', et: 'Elektri' },
    'hübriid': { en: 'Hybrid', ru: 'Гибридный', de: 'Hybrid', fi: 'Hybridi', et: 'Hübriid' },
    'gaas': { en: 'Gas', ru: 'Газ', de: 'Gas', fi: 'Kaasu', et: 'Gaas' },
    'LPG': { en: 'LPG', ru: 'LPG', de: 'LPG', fi: 'LPG', et: 'LPG' },
    'CNG': { en: 'CNG', ru: 'CNG', de: 'CNG', fi: 'CNG', et: 'CNG' },
    'bensiin + gaas (LPG / Vedelgaas)': { en: 'Gasoline + Gas (LPG/Liquefied Gas)', ru: 'Бензин + Газ (LPG/Сжиженный газ)', de: 'Benzin + Gas (LPG/Liquefied Gas)', fi: 'Bensiini + Kaasu (LPG/Vedelgaas)', et: 'Bensiin + Gaas (LPG/Vedelgaas)' },
    'bensiin + gaas (CNG / Surugaas)': { en: 'Gasoline + Gas (CNG/Compressed Gas)', ru: 'Бензин + Газ (CNG/Сжатый газ)', de: 'Benzin + Gas (CNG/Compressed Gas)', fi: 'Bensiini + Kaasu (CNG/Surugaas)', et: 'Bensiin + Gaas (CNG/Surugaas)' },
    'bensiin + gaas (LNG / Veeldatud maagaas)': { en: 'Gasoline + Gas (LNG/Liquefied Natural Gas)', ru: 'Бензин + Газ (LNG/Сжиженный природный газ)', de: 'Benzin + Gas (LNG/Liquefied Natural Gas)', fi: 'Bensiini + Kaasu (LNG/Veeldatud maagaas)', et: 'Bensiin + Gaas (LNG/Veeldatud maagaas)' },
    'diisel + gaas (LNG / Veeldatud maagaas)': { en: 'Diesel + Gas (LNG/Liquefied Natural Gas)', ru: 'Дизель + Газ (LNG/Сжиженный природный газ)', de: 'Diesel + Gas (LNG/Liquefied Natural Gas)', fi: 'Diisel + Kaasu (LNG/Veeldatud maagaas)', et: 'Diisel + Gaas (LNG/Veeldatud maagaas)' },
    'gaas (LPG / Vedelgaas)': { en: 'Gas (LPG/Liquefied Gas)', ru: 'Газ (LPG/Сжиженный газ)', de: 'Gas (LPG/Liquefied Gas)', fi: 'Kaasu (LPG/Vedelgaas)', et: 'Gaas (LPG/Vedelgaas)' },
    'gaas (CNG / Surugaas)': { en: 'Gas (CNG/Compressed Gas)', ru: 'Газ (CNG/Сжатый газ)', de: 'Gas (CNG/Compressed Gas)', fi: 'Kaasu (CNG/Surugaas)', et: 'Gaas (CNG/Surugaas)' },
    'gaas (LNG / Veeldatud maagaas)': { en: 'Gas (LNG/Liquefied Natural Gas)', ru: 'Газ (LNG/Сжиженный природный газ)', de: 'Gas (LNG/Liquefied Natural Gas)', fi: 'Kaasu (LNG/Veeldatud maagaas)', et: 'Gaas (LNG/Veeldatud maagaas)' },
    'vesinik': { en: 'Hydrogen', ru: 'Водород', de: 'Wasserstoff', fi: 'Vesinik', et: 'Vesinik' },
    'hübriid (bensiin / elekter)': { en: 'Hybrid (Gasoline/Electric)', ru: 'Гибрид (бензин/электричество)', de: 'Hybrid (Benzin/Elektro)', fi: 'Hybridi (Bensiini/Sähkö)', et: 'Hübriid (bensiin/elekter)' },
    'hübriid (diisel / elekter)': { en: 'Hybrid (Diesel/Electric)', ru: 'Гибрид (дизель/электричество)', de: 'Hybrid (Diesel/Elektro)', fi: 'Hybridi (Diisel/Sähkö)', et: 'Hübriid (diisel/elekter)' },
    'pistikhübriid (bensiin / elekter)': { en: 'Plug-in Hybrid (Gasoline/Electric)', ru: 'Подключаемый гибрид (бензин/электричество)', de: 'Plug-in Hybrid (Benzin/Elektro)', fi: 'Pistokkeinen Hybridi (Bensiini/Sähkö)', et: 'Pistikuhübriid (bensiin/elekter)' },
    'pistikhübriid (diisel / elekter)': { en: 'Plug-in Hybrid (Diesel/Electric)', ru: 'Подключаемый гибрид (дизель/электричество)', de: 'Plug-in Hybrid (Diesel/Elektro)', fi: 'Pistokkeinen Hybridi (Diisel/Sähkö)', et: 'Pistikuhübriid (diisel/elekter)' },
    
    
    // Transmission types
    'automaat': { en: 'Automatic', ru: 'Автомат', de: 'Automatik', fi: 'Automaatti', et: 'Automaat' },
    'manuaal': { en: 'Manual', ru: 'Механика', de: 'Schaltgetriebe', fi: 'Manuaali', et: 'Manuaal' },
    'poolautomaat': { en: 'Semi-automatic', ru: 'Полуавтомат', de: 'Halbautomatik', fi: 'Puoliautomaatti', et: 'Poolautomaat' },
    
    // Drive types
    'Esivedu': { en: 'Front-wheel drive', ru: 'Передний привод', de: 'Frontantrieb', fi: 'Etuveto', et: 'Esivedu' },
    'Tagavedu': { en: 'Rear-wheel drive', ru: 'Задний привод', de: 'Heckantrieb', fi: 'Takaajo', et: 'Tagavedu' },
    'Nelikvedu': { en: 'All-wheel drive', ru: 'Полный привод', de: 'Allradantrieb', fi: 'Neliveto', et: 'Nelikvedu' },
    
    // Body types
    'sedaan': { en: 'Sedan', ru: 'Седан', de: 'Limousine', fi: 'Sedan', et: 'Sedaan' },
    'universaal': { en: 'Estate', ru: 'Универсал', de: 'Kombi', fi: 'Farmari', et: 'Universaal' },
    'mahtuniversaal': { en: 'MPV', ru: 'Минивэн', de: 'Minivan', fi: 'Tila-auto', et: 'Mahtuniversaal' },
    'luukpära': { en: 'Hatchback', ru: 'Хэтчбек', de: 'Schrägheck', fi: 'Käyttöauto', et: 'Luukpära' },
    'suv': { en: 'SUV', ru: 'Внедорожник', de: 'Geländewagen', fi: 'Maasturi', et: 'SUV' },
    'kupee': { en: 'Coupe', ru: 'Купе', de: 'Coupé', fi: 'Coupé', et: 'Kupee' },
    'kabriolett': { en: 'Convertible', ru: 'Кабриолет', de: 'Cabrio', fi: 'Avoauto', et: 'Kabriolett' },
    'pikap': { en: 'Pickup', ru: 'Пикап', de: 'Pick-up', fi: 'Pakettiauto', et: 'Pikap' },
    'furgon': { en: 'Van', ru: 'Фургон', de: 'Transporter', fi: 'Pakettiauto', et: 'Furgon' },
    'limusiin': { en: 'Limousine', ru: 'Лимузин', de: 'Limousine', fi: 'Limusiini', et: 'Limusiin' },
    
    // Owner count
    // 'Esimene omanik': { en: 'First owner', ru: 'Первый владелец', de: 'Erstbesitzer', fi: 'Ensimmäinen omistaja', et: 'Esimene omanik' },
    // 'Teine omanik': { en: 'Second owner', ru: 'Второй владелец', de: 'Zweitbesitzer', fi: 'Toinen omistaja', et: 'Teine omanik' },
    // 'Kolmas omanik': { en: 'Third owner', ru: 'Третий владелец', de: 'Drittbesitzer', fi: 'Kolmas omistaja', et: 'Kolmas omanik' },
    // 'Neljas omanik': { en: 'Fourth owner', ru: 'Четвертый владелец', de: 'Viertbesitzer', fi: 'Neljäs omistaja', et: 'Neljas omanik' },
    // 'Viies omanik': { en: 'Fifth owner', ru: 'Пятый владелец', de: 'Fünftbesitzer', fi: 'Viides omistaja', et: 'Viies omanik' },
    
    // Accessories and equipment
    'Kokkupõrget Ennetav Pidurisüsteem': { en: 'Collision Prevention Braking System', ru: 'Система предотвращения столкновений', de: 'Kollisionsvermeidungssystem', fi: 'Törmäyksenestojärjestelmä', et: 'Kokkupõrget Ennetav Pidurisüsteem' },
    'Sõiduraja Hoidmise Abisüsteem': { en: 'Lane Keeping Assist System', ru: 'Система помощи удержания полосы', de: 'Spurhalteassistent', fi: 'Kaistapitoavustin', et: 'Sõiduraja Hoidmise Abisüsteem' },
    'Sõidurajavahetamise Abisüsteem': { en: 'Lane Change Assist System', ru: 'Система помощи смены полосы', de: 'Spurwechselassistent', fi: 'Kaistavaihtoavustin', et: 'Sõidurajavahetamise Abisüsteem' },
    'Liiklusmärkide Tuvastus ja Kuvamine': { en: 'Traffic Sign Recognition and Display', ru: 'Распознавание и отображение дорожных знаков', de: 'Verkehrsschilderkennung und -anzeige', fi: 'Liikennemerkkien tunnistus ja näyttö', et: 'Liiklusmärkide Tuvastus ja Kuvamine' },
    'Adaptiivne Püsikiirusehoidja': { en: 'Adaptive Cruise Control', ru: 'Адаптивный круиз-контроль', de: 'Adaptive Geschwindigkeitsregelung', fi: 'Adaptiivinen vakionopeudensäädin', et: 'Adaptiivne Kruiiskontroll' },
    'Bluetooth': { en: 'Bluetooth', ru: 'Bluetooth', de: 'Bluetooth', fi: 'Bluetooth', et: 'Bluetooth' },
    'USB': { en: 'USB', ru: 'USB', de: 'USB', fi: 'USB', et: 'USB' },
    'Pimenurga Hoiatus': { en: 'Blind Spot Warning', ru: 'Предупреждение о слепых зонах', de: 'Toter-Winkel-Warnung', fi: 'Sokean kulman varoitus', et: 'Pimenurga Hoiatus' },
    'Kaugtulede ümberlülitamise Assistent': { en: 'High Beam Assist', ru: 'Помощник дальнего света', de: 'Fernlichtassistent', fi: 'Kaukovalojen avustin', et: 'Kaugtulede ümberlülitamise Assistent' },
    'Võtmeta Avamine': { en: 'Keyless Entry', ru: 'Бесключевой доступ', de: 'Keyless Entry', fi: 'Avaimetön sisäänkäynti', et: 'Võtmeta Avamine' },
    'Võtmeta Käivitus': { en: 'Keyless Start', ru: 'Бесключевой запуск', de: 'Keyless Start', fi: 'Avaimetön käynnistys', et: 'Võtmeta Käivitus' },
    'Massaažifunktsiooniga Istmed': { en: 'Massage Seats', ru: 'Массажные сиденья', de: 'Massagesitze', fi: 'Hierontaisuimet', et: 'Massaažifunktsiooniga Istmed' },
    'Integreeritud Väravapult': { en: 'Integrated Remote Control', ru: 'Интегрированный пульт', de: 'Integrierte Fernbedienung', fi: 'Integroitu kaukosäädin', et: 'Integreeritud Väravapult' },
    'Õhkvedrustus': { en: 'Air Suspension', ru: 'Пневмоподвеска', de: 'Luftfederung', fi: 'Ilmajousitus', et: 'Õhkvedrustus' },
    '4-ratta Pööramine': { en: '4-Wheel Steering', ru: 'Рулевое управление 4 колес', de: '4-Rad-Lenkung', fi: '4-pyörän ohjaus', et: '4-ratta Pööramine' },
    'Öise Nägemise Assistent': { en: 'Night Vision Assistant', ru: 'Помощник ночного видения', de: 'Nachtsichtassistent', fi: 'Yönäköavustin', et: 'Öise Nägemise Assistent' },
    'Häiresüsteem': { en: 'Alarm System', ru: 'Система сигнализации', de: 'Alarmsystem', fi: 'Hälytysjärjestelmä', et: 'Häiresüsteem' },
    'Käetugi': { en: 'Armrest', ru: 'Подлокотник', de: 'Armlehne', fi: 'Käsinoja', et: 'Käetugi' },
    'Käivitusabi mäkketõusul': { en: 'Hill Start Assist', ru: 'Помощь при трогании на подъеме', de: 'Anfahrhilfe', fi: 'Mäenousuavustin', et: 'Käivitusabi mäkketõusul' },
    'CD-mängija': { en: 'CD Player', ru: 'CD-плеер', de: 'CD-Player', fi: 'CD-soitin', et: 'CD-mängija' },
    'Elektrilised aknatõstukid': { en: 'Electric Window Lifters', ru: 'Электростеклоподъемники', de: 'Elektrische Fensterheber', fi: 'Sähköikkunat', et: 'Elektrilised aknatõstukid' },
    'Parkimisandurid Ees ja Taga': { en: 'Parking Sensors Front and Rear', ru: 'Парктроники спереди и сзади', de: 'Einparkhilfe vorne und hinten', fi: 'Pysäköintianturit edessä ja takana', et: 'Parkimisandurid Ees ja Taga' },
    'Parkimiskaamera': { en: 'Parking Camera', ru: 'Камера заднего вида', de: 'Rückfahrkamera', fi: 'Pysäköintikamera', et: 'Parkimiskaamera' },
    'Parkimiskaamera 360°': { en: '360° Parking Camera', ru: 'Камера 360°', de: '360°-Kamera', fi: '360° pysäköintikamera', et: 'Parkimiskaamera 360°' },
    'LED Esituled': { en: 'LED Headlights', ru: 'LED фары', de: 'LED-Scheinwerfer', fi: 'LED-ajovalot', et: 'LED Esituled' },
    'Xenon Esituled': { en: 'Xenon Headlights', ru: 'Ксеноновые фары', de: 'Xenon-Scheinwerfer', fi: 'Ksenon-ajovalot', et: 'Xenon Esituled' },
    'Laser Esituled': { en: 'Laser Headlights', ru: 'Лазерные фары', de: 'Laser-Scheinwerfer', fi: 'Laser-ajovalot', et: 'Laser Esituled' },
    'Elektrilise Soojendusega Esiklaas': { en: 'Electrically Heated Windshield', ru: 'Электрообогрев лобового стекла', de: 'Elektrisch beheizte Frontscheibe', fi: 'Sähköllä lämmitettävä tuulilasi', et: 'Elektrilise Soojendusega Esiklaas' },
    'Kliimaseade': { en: 'Climate Control', ru: 'Климат-контроль', de: 'Klimaanlage', fi: 'Ilmastointi', et: 'Kliimaseade' },
    'Salongi Eelsoojendus': { en: 'Cabin Preheating', ru: 'Предварительный прогрев салона', de: 'Innenraum-Vorheizung', fi: 'Sisätilojen esilämmitys', et: 'Salongi Eelsoojendus' },
    'Mootori Eelsoojendus': { en: 'Engine Preheating', ru: 'Предварительный прогрев двигателя', de: 'Motor-Vorheizung', fi: 'Moottorin esilämmitys', et: 'Mootori Eelsoojendus' },
    'Salongi Lisasoojendus': { en: 'Additional Cabin Heating', ru: 'Дополнительный обогрев салона', de: 'Zusätzliche Innenraumheizung', fi: 'Lisäsisätilojen lämmitys', et: 'Salongi Lisasoojendus' },
    'Istmesoojendused': { en: 'Seat Heating', ru: 'Подогрев сидений', de: 'Sitzheizung', fi: 'Istuinlämmitys', et: 'Istmesoojendused' },
    'Elektriliselt Reguleeritavad Istmed': { en: 'Electrically Adjustable Seats', ru: 'Электрорегулируемые сиденья', de: 'Elektrisch verstellbare Sitze', fi: 'Sähköisesti säädettävät istuimet', et: 'Elektriliselt Reguleeritavad Istmed' },
    'Comfort Istmed': { en: 'Comfort Seats', ru: 'Комфортные сиденья', de: 'Komfortsitze', fi: 'Mukavat istuimet', et: 'Comfort Istmed' },
    'Sport Istmed': { en: 'Sport Seats', ru: 'Спортивные сиденья', de: 'Sportsitze', fi: 'Urheiluistuimet', et: 'Sport Istmed' },
    'Nahkpolster': { en: 'Leather Upholstery', ru: 'Кожаная обивка', de: 'Lederpolster', fi: 'Nahkapäällyste', et: 'Nahkpolster' },
    'Poolnahkpolster': { en: 'Semi-Leather Upholstery', ru: 'Полукожаная обивка', de: 'Halblederpolster', fi: 'Puolinnahkapäällyste', et: 'Poolnahkpolster' },
    'Tagaistme Seljatugi Allaklapitav': { en: 'Foldable Rear Seat Backrest', ru: 'Складывающаяся спинка заднего сиденья', de: 'Klappbare Rücksitzlehne', fi: 'Taittuva takaistuimen selkänoja', et: 'Tagaistme Seljatugi Allaklapitav' },
    'Eraldi Kliimaseade Tagaistmetele': { en: 'Separate Climate Control for Rear Seats', ru: 'Отдельный климат-контроль для задних сидений', de: 'Separate Klimaanlage für Rücksitze', fi: 'Erikoinen ilmastointi takaistuimille', et: 'Eraldi Kliimaseade Tagaistmetele' },
    'Pakiruumi Avamine ja Sulgemine Elektriliselt': { en: 'Electric Tailgate', ru: 'Электропривод багажника', de: 'Elektrische Heckklappe', fi: 'Sähköinen takaluukku', et: 'Pakiruumi Avamine ja Sulgemine Elektriliselt' },
    'Soojendusega Rool': { en: 'Heated Steering Wheel', ru: 'Подогрев руля', de: 'Beheiztes Lenkrad', fi: 'Lämmitettävä ohjauspyörä', et: 'Soojendusega Rool' },
    'Ventileeritavad Istmed': { en: 'Ventilated Seats', ru: 'Вентилируемые сиденья', de: 'Belüftete Sitze', fi: 'Tuulettavat istuimet', et: 'Ventileeritavad Istmed' },
    'Info Kuvamine Esiklaasile': { en: 'Head-Up Display', ru: 'Проекционный дисплей', de: 'Head-Up-Display', fi: 'Päällä näyttö', et: 'Info Kuvamine Esiklaasile' },
    'Uste Servosulgurid': { en: 'Power Door Locks', ru: 'Электрозамки дверей', de: 'Elektrische Türschlösser', fi: 'Sähköiset ovilukot', et: 'Uste Servosulgurid' },
    'Topeltklaasid': { en: 'Double Glazing', ru: 'Двойное остекление', de: 'Doppelverglasung', fi: 'Kaksinkertainen lasitus', et: 'Topeltklaasid' },
    'Rulookardinad Ustel': { en: 'Roller Blinds on Windows', ru: 'Рулонные шторы на окнах', de: 'Rollos an den Fenstern', fi: 'Rullaverhot ikkunoissa', et: 'Rulookardinad Ustel' },
    'Stereo': { en: 'Stereo', ru: 'Стерео', de: 'Stereo', fi: 'Stereo', et: 'Stereo' },
    'Veokonks': { en: 'Trailer Hitch', ru: 'Фаркоп', de: 'Anhängerkupplung', fi: 'Perävaunuun', et: 'Veokonks' },
    'Elektrilised Liuguksed': { en: 'Electric Sliding Doors', ru: 'Электропривод раздвижных дверей', de: 'Elektrische Schiebetüren', fi: 'Sähköiset liukuovet', et: 'Elektrilised Liuguksed' },
    'Valgustuspakett': { en: 'Lighting Package', ru: 'Пакет освещения', de: 'Beleuchtungspaket', fi: 'Valaistuspaketti', et: 'Valgustuspakett' },
    'Suverehvid': { en: 'Summer Tires', ru: 'Летние шины', de: 'Sommerreifen', fi: 'Kesärenkaat', et: 'Suverehvid' },
    'Talverehvid': { en: 'Winter Tires', ru: 'Зимние шины', de: 'Winterreifen', fi: 'Talvirenkaat', et: 'Talverehvid' },
    'Valuveljed': { en: 'Alloy Wheels', ru: 'Легкосплавные диски', de: 'Leichtmetallfelgen', fi: 'Valuvanteet', et: 'Valuveljed' },
    'Panoraamkatus (klaasist)': { en: 'Panoramic Glass Roof', ru: 'Панорамная крыша из стекла', de: 'Panoramaglasdach', fi: 'Panoraamikatto (lasista)', et: 'Panoraamkatus (klaasist)' },
    'Katuseluuk': { en: 'Sunroof', ru: 'Люк в крыше', de: 'Schiebedach', fi: 'Kattoluukku', et: 'Katuseluuk' },
    'Reguleeritav Vedrustus': { en: 'Adjustable Suspension', ru: 'Регулируемая подвеска', de: 'Verstellbare Federung', fi: 'Säädettävä jousitus', et: 'Reguleeritav Vedrustus' },

    //vehicleTypes
    'Sõiduauto': { en: 'Passenger Car', ru: 'Легковой автомобиль', de: 'Personenwagen', fi: 'Henkilöauto', et: 'Sõiduauto' },
    'Veesõiduk': { en: 'Watercraft', ru: 'Водный транспорт', de: 'Wasserfahrzeug', fi: 'Vesikulkuneuvo', et: 'Veesõiduk' },
    'Põllumajandustehnika': { en: 'Agricultural Machinery', ru: 'Сельскохозяйственная техника', de: 'Landmaschinen', fi: 'Maatalouskoneet', et: 'Põllumajandustehnika' },
    'Võistlussõiduk': { en: 'Racing Vehicle', ru: 'Гоночный автомобиль', de: 'Rennfahrzeug', fi: 'Kilpa-autom', et: 'Võistlussõiduk' },
    'Luukpära': { en: 'Hatchback', ru: 'Хэтчбек', de: 'Hatchback', fi: 'Hatchback', et: 'Luukpära' },
    'Maastur': { en: 'SUV', ru: 'Внедорожник', de: 'Geländewagen', fi: 'Maasturi', et: 'Maastur' },
    'Muu': { en: 'Other', ru: 'Другое', de: 'Sonstiges', fi: 'Muu', et: 'Muu' },
    'Kaubik': { en: 'Van', ru: 'Фургон', de: 'Lieferwagen', fi: 'Pakettiauto', et: 'Kaubik' },
    'Buss': { en: 'Bus', ru: 'Автобус', de: 'Bus', fi: 'Bussi', et: 'Buss' },
    'Veoauto': { en: 'Truck', ru: 'Грузовик', de: 'Lkw', fi: 'Kuorma-auto', et: 'Veoauto' },
    'Haagis': { en: 'Trailer', ru: 'Прицеп', de: 'Anhänger', fi: 'Perävaunu', et: 'Haagis' },
    'Mototehnika': { en: 'Motor Technology', ru: 'Мототехника', de: 'Mototechnik', fi: 'Moottoritekniikka', et: 'Mototehnika' },
    'Haagissuvila': { en: 'Trailer Villa', ru: 'Прицеп-вилла', de: 'Wohnwagen', fi: 'Perävaunuvilla', et: 'Haagissuvila' },
    'Autoelamu': { en: 'Mobile Home', ru: 'Дом на колесах', de: 'Wohnmobil', fi: 'Asuntovaunu', et: 'Autoelamu' },
    'Ehitustehnika': { en: 'Construction Equipment', ru: 'Строительная техника', de: 'Baumaschinen', fi: 'Rakennuskoneet', et: 'Ehitustehnika' },
    'Metsatehnika': { en: 'Forestry Equipment', ru: 'Лесная техника', de: 'Forstmaschinen', fi: 'Metsäkoneet', et: 'Metsatehnika' },
    'Kommunaaltehnika': { en: 'Municipal Equipment', ru: 'Коммунальная техника', de: 'Kommunaltechnik', fi: 'Kunnalliskoneet', et: 'Kommunaaltehnika' },

    //CarColor
    'beež': { en: 'Beige', ru: 'Бежевый', de: 'Beige', fi: 'Beige', et: 'Beež' },
    'helebeež': { en: 'Light Beige', ru: 'Светло-бежевый', de: 'Hellbeige', fi: 'Vaalea beige', et: 'Hele beež' },
    'heleanž': { en: 'Light Orange', ru: 'Светло-оранжевый', de: 'Hellorange', fi: 'Vaalea oranssi', et: 'Heleanž' },
    'hõbedane': { en: 'Silver', ru: 'Серебряный', de: 'Silber', fi: 'Hopea', et: 'Hõbedane' },
    'heleoranž': { en: 'Light Orange', ru: 'Светло-оранжевый', de: 'Hellorange', fi: 'Vaalea oranssi', et: 'Hele Oranž' },
    'oranž': { en: 'Orange', ru: 'Оранжевый', de: 'Orange', fi: 'Oranssi', et: 'Oranž' },
    'tumebeež': { en: 'Dark Beige', ru: 'Темно-бежевый', de: 'Dunkelbeige', fi: 'Tumma beige', et: 'Tume Beež' },
    'tumeoranž': { en: 'Dark Orange', ru: 'Темно-оранжевый', de: 'Dunkelorange', fi: 'Tumma oranssi', et: 'Tume Oranž' },
    'metallikvärv': { en: 'Metallic Color', ru: 'Металлик', de: 'Metallic', fi: 'Metalliväri', et: 'Metallikvärv' },
    'hall': { en: 'Gray', ru: 'Серый', de: 'Grau', fi: 'Harmaa', et: 'Hall' },
    'helehall': { en: 'Light Gray', ru: 'Светло-серый', de: 'Hellgrau', fi: 'Vaalea harmaa', et: 'Hele hall' },
    'helekollane': { en: 'Light Yellow', ru: 'Светло-желтый', de: 'Hellgelb', fi: 'Vaalea keltainen', et: 'Hele kollane' },
    'helelilla': { en: 'Light Purple', ru: 'Светло-фиолетовый', de: 'Helllila', fi: 'Vaalea violetti', et: 'Hele Lilla' },
    'helepruun': { en: 'Light Brown', ru: 'Светло-коричневый', de: 'Hellbraun', fi: 'Vaalea ruskea', et: 'Hele Pruun' },
    'helepunane': { en: 'Light Red', ru: 'Светло-красный', de: 'Hellrot', fi: 'Vaalea punainen', et: 'Hele Punane' },
    'pruun': { en: 'Brown', ru: 'Коричневый', de: 'Braun', fi: 'Ruskea', et: 'Pruun' },
    'helesinine': { en: 'Light Blue', ru: 'Светло-синий', de: 'Hellblau', fi: 'Vaalea sininen', et: 'Hele Sinine' },
    'kollane': { en: 'Yellow', ru: 'Желтый', de: 'Gelb', fi: 'Keltainen', et: 'Kollane' },
    'kuldne': { en: 'Gold', ru: 'Золотой', de: 'Gold', fi: 'Kulta', et: 'Kuldne' },
    'lilla': { en: 'Purple', ru: 'Фиолетовый', de: 'Lila', fi: 'Violetti', et: 'Lilla' },
    'must': { en: 'Black', ru: 'Черный', de: 'Schwarz', fi: 'Musta', et: 'Must' },
    'tavaline': { en: 'Standard', ru: 'Стандартный', de: 'Standard', fi: 'Tavallinen', et: 'Tavaline' },
    'metallik': { en: 'Metallic', ru: 'Металлик', de: 'Metallic', fi: 'Metallinen', et: 'Metallik' },
    'punane': { en: 'Red', ru: 'Красный', de: 'Rot', fi: 'Punainen', et: 'Punane' },
    'roheline': { en: 'Green', ru: 'Зеленый', de: 'Grün', fi: 'Vihreä', et: 'Roheline' },
    'roosa': { en: 'Pink', ru: 'Розовый', de: 'Rosa', fi: 'Vaaleanpunainen', et: 'Roosa' },
    'sinine': { en: 'Blue', ru: 'Синий', de: 'Blau', fi: 'Sininen', et: 'Sinine' },
    'tumehall': { en: 'Dark Gray', ru: 'Темно-серый', de: 'Dunkelgrau', fi: 'Tumma harmaa', et: 'Tume Hall' },
    'tumekollane': { en: 'Dark Yellow', ru: 'Темно-желтый', de: 'Dunkelgelb', fi: 'Tumma keltainen', et: 'Tume Kollane' },
    'tumelilla': { en: 'Dark Purple', ru: 'Темно-фиолетовый', de: 'Dunkellila', fi: 'Tumma violetti', et: 'Tume Lilla' },
    'tumerpruun': { en: 'Dark Brown', ru: 'Темно-коричневый', de: 'Dunkelbraun', fi: 'Tumma ruskea', et: 'Tumer Pruun' },
    'tumepunane': { en: 'Dark Red', ru: 'Темно-красный', de: 'Dunkelrot', fi: 'Tumma punainen', et: 'Tume Punane' },
    'tumeroheline': { en: 'Dark Green', ru: 'Темно-зеленый', de: 'Dunkelgrün', fi: 'Tumma vihreä', et: 'Tume Roheline' },
    'tumesinine': { en: 'Dark Blue', ru: 'Темно-синий', de: 'Dunkelblau', fi: 'Tumma sininen', et: 'Tume Sinine' },
    'valge': { en: 'White', ru: 'Белый', de: 'Weiß', fi: 'Valkoinen', et: 'Valge' },
    'heleroheline': { en: 'Light Green', ru: 'Светло-зеленый', de: 'Hellgrün', fi: 'Vaalea vihreä', et: 'Hele Roheline' },
  };
  
  // Try to find exact match first
  if (translations[value] && translations[value][currentLanguage]) {
    return translations[value][currentLanguage];
  }
  
  // Try partial matches for compound values
  for (const [estonian, translationMap] of Object.entries(translations)) {
    if (value.includes(estonian) && translationMap[currentLanguage]) {
      return value.replace(estonian, translationMap[currentLanguage]);
    }
  }
  
  return value; // Return original if no translation found
};

// Translation function for equipment text using DeepL API
export const translateEquipmentText = async (text: string, targetLanguage: string): Promise<string> => {
  if (!text || targetLanguage === 'ee') {
    return text;
  }

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        targetLanguage: targetLanguage,
        sourceLanguage: 'ee'
      }),
    });

    if (!response.ok) {
      console.warn('Translation failed, using original text');
      return text;
    }

    const result = await response.json();
    return result.translatedText || text;
  } catch (error) {
    console.warn('Translation error:', error);
    return text;
  }
};
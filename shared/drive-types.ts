export interface DriveType {
  id: number;
  name: string;
  ee_name: string;
  created_at?: string;
}

export const DRIVE_TYPES = [
  { id: 1, name: "kabriolett", ee_name: "Kabriolett", label: "Kabriolett" },
  { id: 2, name: "karavan", ee_name: "Karavan", label: "Karavan" },
  { id: 3, name: "kaubik", ee_name: "Kaubik", label: "Kaubik" },
  { id: 4, name: "kupee", ee_name: "Kupee", label: "Kupee" },
  { id: 5, name: "luukpara", ee_name: "Luukpära", label: "Luukpära" },
  { id: 6, name: "limusiin", ee_name: "Limusiin", label: "Limusiin" },
  { id: 7, name: "mitmeotstarbeline", ee_name: "Mitmeotstarbeline", label: "Mitmeotstarbeline" },
  { id: 8, name: "pikap", ee_name: "Pikap", label: "Pikap" },
  { id: 9, name: "sedaan", ee_name: "Sedaan", label: "Sedaan" },
  { id: 10, name: "vaikekaubik", ee_name: "Väikekaubik", label: "Väikekaubik" },
  { id: 11, name: "universaal", ee_name: "Universaal", label: "Universaal" },
  { id: 12, name: "mahtuniversaal", ee_name: "Mahtuniversaal", label: "Mahtuniversaal" },
]; 
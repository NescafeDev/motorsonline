export interface DriveType {
  id: number;
  name: string;
  ee_name: string;
  created_at?: string;
}

export const DRIVE_TYPES = [
  { id: 1, name: "esivedu", ee_name: "Esivedu", label: "Esivedu" },
  { id: 2, name: "tagavedu", ee_name: "Tagavedu", label: "Tagavedu" },
  { id: 3, name: "nelikvedu", ee_name: "Nelikvedu", label: "Nelikvedu" },
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
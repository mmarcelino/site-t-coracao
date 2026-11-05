import type { Localized } from "@/lib/data/types";

/**
 * Landmarks for "Nearby" on apartment pages. Each flat shows the closest ones with a walking time
 * worked out from its building's address (`src/lib/data/nearby.ts`), so times are per building, not
 * per neighbourhood. Coordinates are approximate (entrances or the middle of a street/garden).
 * TO CONFIRM: the client may want to add their own favourites or check the times on foot.
 */
export interface Landmark {
  name: Localized;
  lat: number;
  lng: number;
}

export const landmarks: Landmark[] = [
  { name: { pt: "Palácio da Bolsa", en: "Palácio da Bolsa" }, lat: 41.1413, lng: -8.6155 },
  { name: { pt: "Cais da Ribeira", en: "Ribeira quay" }, lat: 41.1406, lng: -8.6131 },
  { name: { pt: "Ponte Luís I", en: "Luís I Bridge" }, lat: 41.1399, lng: -8.6094 },
  { name: { pt: "Rua das Flores", en: "Rua das Flores" }, lat: 41.1438, lng: -8.6128 },
  { name: { pt: "Estação de São Bento", en: "São Bento station" }, lat: 41.1456, lng: -8.6107 },
  { name: { pt: "Sé do Porto", en: "Porto Cathedral" }, lat: 41.1429, lng: -8.6113 },
  { name: { pt: "Mercado do Bolhão", en: "Bolhão Market" }, lat: 41.1489, lng: -8.6067 },
  { name: { pt: "Avenida dos Aliados", en: "Avenida dos Aliados" }, lat: 41.1468, lng: -8.6113 },
  { name: { pt: "Café Majestic", en: "Café Majestic" }, lat: 41.1473, lng: -8.6063 },
  { name: { pt: "Torre dos Clérigos", en: "Clérigos Tower" }, lat: 41.1457, lng: -8.6146 },
  { name: { pt: "Livraria Lello", en: "Livraria Lello" }, lat: 41.1469, lng: -8.6149 },
  { name: { pt: "Jardim da Cordoaria", en: "Cordoaria gardens" }, lat: 41.1468, lng: -8.6165 },
  { name: { pt: "Igreja do Carmo", en: "Carmo Church" }, lat: 41.1474, lng: -8.6165 },
  { name: { pt: "Miradouro da Vitória", en: "Vitória viewpoint" }, lat: 41.1437, lng: -8.6146 },
  { name: { pt: "Jardim das Virtudes", en: "Virtudes garden" }, lat: 41.1433, lng: -8.6198 },
  { name: { pt: "Rua de Miguel Bombarda", en: "Rua de Miguel Bombarda" }, lat: 41.1527, lng: -8.6206 },
  { name: { pt: "Jardim do Passeio Alegre", en: "Passeio Alegre garden" }, lat: 41.1486, lng: -8.6745 },
  { name: { pt: "Farol de Felgueiras", en: "Felgueiras lighthouse" }, lat: 41.1474, lng: -8.6792 },
  { name: { pt: "Praias da Foz", en: "Foz beaches" }, lat: 41.1536, lng: -8.681 },
];

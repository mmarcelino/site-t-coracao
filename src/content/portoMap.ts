import type { Localized } from "@/lib/data/types";

/**
 * Illustrated map of central Porto and Foz (no map library, no outside calls). Shapes are traced
 * roughly from real coordinates, so pins placed from each building's lat/lng land in the right
 * place; it is a guide, not a street map.
 */
export const mapBounds = { west: -8.69, east: -8.594, south: 41.132, north: 41.158 };

/** Douro river: north bank west→east, then south bank east→west. */
export const river: Array<[number, number]> = [
  [-8.681, 41.1478], [-8.676, 41.1473], [-8.668, 41.1462], [-8.66, 41.1454], [-8.65, 41.1443],
  [-8.64, 41.1433], [-8.63, 41.1418], [-8.62, 41.1402], [-8.612, 41.1396], [-8.605, 41.1393],
  [-8.598, 41.1398], [-8.594, 41.1405],
  [-8.594, 41.1379], [-8.598, 41.1372], [-8.605, 41.1367], [-8.612, 41.1369], [-8.62, 41.1374],
  [-8.63, 41.1389], [-8.64, 41.1404], [-8.65, 41.1416], [-8.66, 41.1424], [-8.668, 41.1426],
  [-8.674, 41.1432], [-8.681, 41.1434],
];

/** Atlantic: everything west of the coast (north of the river mouth, then south of it). */
export const sea: Array<[number, number]> = [
  [-8.69, 41.158], [-8.6862, 41.158], [-8.6835, 41.1552], [-8.681, 41.152], [-8.6792, 41.149],
  [-8.6782, 41.1475], [-8.6782, 41.1436], [-8.6725, 41.1428], [-8.6708, 41.1395], [-8.6698, 41.132],
  [-8.69, 41.132],
];

export const mapLabels: Array<{ text: Localized; at: [number, number]; kind: "area" | "water" | "city" }> = [
  { text: { pt: "Foz do Douro", en: "Foz do Douro" }, at: [-8.667, 41.1515], kind: "area" },
  { text: { pt: "Cedofeita", en: "Cedofeita" }, at: [-8.6265, 41.1542], kind: "area" },
  { text: { pt: "Ribeira", en: "Ribeira" }, at: [-8.6062, 41.1412], kind: "area" },
  { text: { pt: "Baixa", en: "Baixa" }, at: [-8.6062, 41.1488], kind: "area" },
  { text: { pt: "Massarelos", en: "Massarelos" }, at: [-8.6455, 41.1478], kind: "area" },
  { text: { pt: "Rio Douro", en: "Douro river" }, at: [-8.636, 41.1406], kind: "water" },
  { text: { pt: "Oceano Atlântico", en: "Atlantic Ocean" }, at: [-8.6825, 41.1395], kind: "water" },
  { text: { pt: "Vila Nova de Gaia", en: "Vila Nova de Gaia" }, at: [-8.622, 41.1345], kind: "city" },
];

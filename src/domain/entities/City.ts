/**
 * Domain entity: a city (Kota) — the top level of the BNI master-data
 * hierarchy. A city contains many chapters.
 */
export type CityStatus = "Active" | "Inactive";

export interface City {
  id: string;
  name: string;
  code: string;
  province: string;
  status: CityStatus;
}

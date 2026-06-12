import type { City } from "@/domain/entities/City";

export interface CityWithStats {
  city: City;
  chapterCount: number;
  memberCount: number;
}

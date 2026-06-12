import type { Chapter } from "@/domain/entities/Chapter";

export const chaptersSeed: Chapter[] = [
  { id: "ch-rise", name: "Rise", code: "RISE", cityId: "city-jkt", status: "Active", meetingDay: "Selasa", meetingTime: "07:00", venue: "Hotel Suites Jakarta", launchDate: "2022-03-15" },
  { id: "ch-grow", name: "Grow", code: "GROW", cityId: "city-jkt", status: "Forming", meetingDay: "Rabu", meetingTime: "07:00", venue: "Hotel Suites Jakarta", launchDate: "2024-01-10" },
  { id: "ch-amplify", name: "Amplify", code: "AMPL", cityId: "city-bdg", status: "Active", meetingDay: "Kamis", meetingTime: "06:30", venue: "Hotel Savoy Homann Bandung", launchDate: "2021-09-01" },
  { id: "ch-glorify", name: "Glorify", code: "GLOR", cityId: "city-bdg", status: "Active", meetingDay: "Jumat", meetingTime: "07:00", venue: "Hotel Savoy Homann Bandung", launchDate: "2022-06-20" },
  { id: "ch-magnify", name: "Magnify", code: "MAGN", cityId: "city-sby", status: "Active", meetingDay: "Selasa", meetingTime: "07:00", venue: "Hotel Majapahit Surabaya", launchDate: "2021-11-05" },
  { id: "ch-garuda", name: "Garuda", code: "GRUD", cityId: "city-tgr", status: "Active", meetingDay: "Rabu", meetingTime: "06:30", venue: "AEON Mall BSD Tangerang", launchDate: "2023-02-14" },
];

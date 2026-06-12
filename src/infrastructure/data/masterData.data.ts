import type { MasterData } from "@/domain/entities/MasterData";

export const masterDataSeed: MasterData = {
  plans: [
    { id: "plan-basic", name: "Basic", price: 1_500_000, duration: "12 months", features: ["Basic Support", "Member Directory"], status: "Active" },
    { id: "plan-premium", name: "Premium", price: 2_500_000, duration: "12 months", features: ["Priority Support", "Member Directory", "Event Access", "Training"], status: "Active" },
  ],
};

import { getActivePremuimPlans } from "@/services/server/plan.server";
import PremiumPlans from "./PremiumPlans";
export const dynamic = "force-dynamic";

export default async function PremiumPage() {
  const plans = await getActivePremuimPlans();
  return (
    <div className="">
      <PremiumPlans plans={plans} />
    </div>
  );
}

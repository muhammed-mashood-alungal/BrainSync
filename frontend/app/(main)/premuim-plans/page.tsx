import { getActivePremuimPlans } from "@/services/server/plan.server";
import PremiumPlans from "./PremiumPlans";

export default async function PremiumPage() {

    const plans = await getActivePremuimPlans()
    console.log(plans)
    return (
    <div className="">
      <PremiumPlans plans={plans} />
    </div>
  );
}

"use client";
import React, { useCallback, useEffect, useState } from "react";
import PlansListing from "./PlanListing";
import BaseModal from "@/components/ui/modal/BaseModal";
import CreatePlan from "./createPlan";
import { plansServices } from "@/services/client/plans.client";
import { toast } from "react-hot-toast";
import { IPlans } from "@/types/plans.types";
import { SUBSCRIPTION_MESSAGES } from "@/constants/messages/subscription.messages";
import Button from "@/components/ui/button/Button";

function Page() {
  const [plans, setPlans] = useState<IPlans[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      const result = await plansServices.getAllPlans();
      setPlans(result);
    };
    fetchPlans();
  }, []);

  const onToggle = async (planId: string, state: boolean) => {
    try {
      await plansServices.toggleActive(planId);
      setPlans((prev) => {
        return prev.map((plan) => {
          return plan._id == planId ? { ...plan, isActive: state } : plan;
        });
      });
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error((error as Error).message);
    }
  };
  const onEdit = async (planId: string, newData: Omit<IPlans, "_id">) => {
    await plansServices.updatePlan(planId, newData);
    setPlans((prev) => {
      return prev.map((plan) => {
        return plan._id == planId ? { ...plan, ...newData } : plan;
      });
    });
    toast.success(SUBSCRIPTION_MESSAGES.PLAN_UPDATED);
  };

  const createPlan = async (plan: any) => {
    try {
      const result = await plansServices.createPlan(plan);
      setIsModalOpen(false);
      setPlans((prev) => {
        return [...prev, result as IPlans];
      });
    } catch (error: any) {
      toast.error((error as Error).message);
    }
  };

  const handleCloseModal = useCallback(() => setIsModalOpen(false), []);
  return (
    <>
      <div className="flex justify-between items-center mb-6 ml-5">
        <h1 className="text-3xl font-bold text-white">Subscription Plans</h1>

        <Button
          variant="admin-primary"
          onClick={() => setIsModalOpen(true)}
        >
          Create New Plan
        </Button>
      </div>
      <PlansListing plans={plans} onToggleActive={onToggle} onEdit={onEdit} />

      <BaseModal isOpen={isModalOpen} onClose={handleCloseModal} title="">
        <CreatePlan onSubmit={createPlan} />
      </BaseModal>
    </>
  );
}

export default Page;

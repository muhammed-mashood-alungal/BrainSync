"use client";

import Table from "@/components/ui/table/Table";
import { useAuth } from "@/context/auth.context";
import { subscriptionServices } from "@/services/client/subscription.client";
import { IPlans } from "@/types/plans.types";
import { IUserSubscription } from "@/types/subscriptionTypes";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";

function SubscriptionHistory() {
  const [subscriptions, setSubscribtions] = useState<IUserSubscription[]>([]);
  const { user } = useAuth();
  useEffect(() => {
    fetchSubscribers();
  }, []);

  async function fetchSubscribers() {
    const history = await subscriptionServices.getUserSubscription(
      user?.id as string
    );
    setSubscribtions(history);
  }

  const columns = [
    {
      key: "planId" as keyof IUserSubscription,
      label: "Plan",
      render: (subscribtion: IUserSubscription) => {
        return (
          <div className="flex items-center gap-2">
            <div className="text-teal-500"></div>
            <span>{(subscribtion.planId as IPlans)?.name}</span>
          </div>
        );
      },
    },
    {
      key: "startDate" as keyof IUserSubscription,
      label: "Started Date",
      render: (subscribtion: IUserSubscription) => {
        const date = new Date(subscribtion.startDate as Date);
        return format(new Date(date), "MMM d 'at' h:mma");
      },
    },
    {
      key: "endDate" as keyof IUserSubscription,
      label: "endDate",
      render: (subscribtion: IUserSubscription) => {
        const date = new Date(subscribtion.endDate as Date);
        return format(new Date(date), "MMM d 'at' h:mma");
      },
    },
    {
      key: "status" as keyof IUserSubscription,
      label: "Status",
      render: (subscribtion: IUserSubscription) => subscribtion.status,
    },
  ];

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold">Subscription History</h1>
        <Table data={subscriptions} columns={columns} ShowSearchBar={false} />
      </div>
    </>
  );
}

export default SubscriptionHistory;

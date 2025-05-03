"use client";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import Table from "@/Components/Table/Table";
import { IUserSubscription } from "@/types/subscriptionTypes";
import { IUserType } from "@/types/userTypes";
import { IPlans } from "@/types/plans.types";
import { subscriptionServices } from "@/services/client/subscription.client";
import Confirm from "@/Components/ConfirmModal/ConfirmModal";

function SubscriptionList() {
  const [subscriptions, setSubscribers] = useState<IUserSubscription[]>([]);
  const [ selectedSubscriptionId , setSubscriptionId] = useState('')
  const limit = 8;
  const [totalCount, setTotalCount] = useState(0);
  useEffect(() => {
    fetchSubscribers(1, limit, "All");
  }, []);

  async function fetchSubscribers(
    currentPage: number,
    limit: number,
    status: string
  ) {
    const { subscriptions, count } =
      await subscriptionServices.getAllSubscription(
        status,
        (currentPage - 1) * limit,
        limit
      );
    setTotalCount(count);
    setSubscribers(subscriptions);
  }

  const cancelSubscribtion = async () => {
    try {
      await subscriptionServices.cancelSubscription(
        selectedSubscriptionId
      );
      setSubscribers((prev) => {
        return prev.map((sub) => {
          return sub._id == selectedSubscriptionId
            ? { ...sub, status: "cancelled" }
            : sub;
        });
      });
      setSubscriptionId('')
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      key: "userId" as keyof IUserSubscription,
      label: "User Email",
      render: (subscribtion: IUserSubscription) => (
        <div className="flex items-center gap-2">
          <div className="text-teal-500"></div>
          <span>{(subscribtion.userId as IUserType).email}</span>
        </div>
      ),
    },
    {
      key: "planId" as keyof IUserSubscription,
      label: "Plan",
      render: (subscribtion: IUserSubscription) => {
        return (
          <div className="flex items-center gap-2">
            <div className="text-teal-500"></div>
            <span>{(subscribtion.planId as IPlans).name}</span>
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

  // Actions for each row (optional)
  const actions = (subscription: IUserSubscription) => (
    <div className="flex space-x-2">
      <button
        className={`${
          subscription.status == "active"
            ? "text-red-500 hover:text-red-700"
            : "text-gray-700"
        } `}
        onClick={() => setSubscriptionId(subscription._id)}
        disabled={subscription.status == "cancelled"}
      >
        Cancel
      </button>
    </div>
  );

  const dropDownList = [
    { value: "active", label: "Active" },
    { value: "expired", label: "Expired" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <>
      <Table
        data={subscriptions}
        columns={columns}
        actions={actions}
        totalCount={totalCount}
        onPageChange={(page: number, limit: number, _: any, status) =>
          fetchSubscribers(page, limit, status as string)
        }
        ShowDropDown={true}
        dropDownLists={dropDownList}
        ShowSearchBar={false}
      />
      <Confirm isOpen={Boolean(selectedSubscriptionId)} onClose={()=>setSubscriptionId('')} onConfirm={cancelSubscribtion}/>
    </>
  );
}

export default SubscriptionList;

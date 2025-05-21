import React from "react";
import SubscriptionList from "./ListSubscriptions";
import SubscriptionStats from "./SubscriptionStats";

function page() {
  return (
    <div className="ml-5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-0">
          All Subsriptions
        </h1>
      </div>
      <SubscriptionStats/>
      <SubscriptionList />
    </div>
  );
}

export default page;

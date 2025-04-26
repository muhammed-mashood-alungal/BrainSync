// wherever your component is

import AdminDashboard from "./Dashobard";

export default function AdminDashboardPage() {

  const userDistribution = {
    free: 9876,
    paid: 2667,
  };

  return (
    <AdminDashboard
      userDistribution={userDistribution}
    />
  );
}

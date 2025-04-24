// wherever your component is

import AdminDashboard from "./Dashobard";

export default function AdminDashboardPage() {
  const sessionTrends = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));

    return {
      date: date.toISOString().split('T')[0],
      sessions: Math.floor(Math.random() * 100) + 50,
    };
  });

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

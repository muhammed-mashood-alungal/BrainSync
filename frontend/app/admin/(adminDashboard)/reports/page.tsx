import ReportsListing from "./ReportsListing";

const Reports: React.FC = async () => {
  return (
    <div className="p-6 md:p-8">
      <h2 className="text-3xl m-2">All Reports</h2>
      <ReportsListing />
    </div>
  );
};

export default Reports;

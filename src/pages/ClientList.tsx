import { useNavigate } from "react-router-dom";

const mockClients = [
  { id: 1, name: "John & Jane Smith", lastReport: "2024-12-01" },
  { id: 2, name: "Robert & Mary Johnson", lastReport: "2024-11-15" },
  { id: 3, name: "William Brown", lastReport: "2025-01-10" },
];

export default function ClientList() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">AW Client Portal</h1>
          <p className="text-sm text-gray-500 mt-1">Windbrook Solutions</p>
        </div>
        <button
          onClick={() => navigate("/add-client")}
          className="bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition"
        >
          + Add Client
        </button>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 py-10">
        <h2 className="text-lg font-semibold text-gray-700 mb-6">
          All Clients
        </h2>

        <div className="flex flex-col gap-4">
          {mockClients.map((client) => (
            <div
              key={client.id}
              onClick={() => navigate(`/client/${client.id}`)}
              className="bg-white border border-gray-200 rounded-xl px-6 py-5 flex items-center justify-between cursor-pointer hover:shadow-md transition"
            >
              <div>
                <p className="text-base font-semibold text-gray-800">
                  {client.name}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Last report: {client.lastReport}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/client/${client.id}/generate-report`);
                  }}
                  className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition"
                >
                  Generate Report
                </button>
                <span className="text-gray-300 text-xl">›</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

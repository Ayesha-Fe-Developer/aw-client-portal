import { useNavigate, useParams } from "react-router-dom";

const mockReports = [
  {
    id: 1,
    quarter: "Q1 2025",
    date: "2025-01-10",
    inflow: 15000,
    outflow: 11000,
    grandTotal: 1250000,
    status: "Generated",
  },
  {
    id: 2,
    quarter: "Q4 2024",
    date: "2024-10-08",
    inflow: 15000,
    outflow: 11000,
    grandTotal: 1180000,
    status: "Generated",
  },
  {
    id: 3,
    quarter: "Q3 2024",
    date: "2024-07-12",
    inflow: 14000,
    outflow: 10500,
    grandTotal: 1120000,
    status: "Generated",
  },
];

export default function ReportHistory() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/client/${id}`)}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-xl font-bold text-blue-900">Report History</h1>
            <p className="text-sm text-gray-400 mt-1">
              John & Jane Smith — all generated reports
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/client/${id}/generate-report`)}
          className="px-4 py-2 rounded-lg bg-blue-700 text-white text-sm font-medium hover:bg-blue-800 transition"
        >
          Generate New Report
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-10">
        <div className="flex flex-col gap-4">
          {mockReports.map((report) => (
            <div
              key={report.id}
              className="bg-white border border-gray-200 rounded-xl px-6 py-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Quarter Badge */}
                  <div className="bg-blue-700 text-white rounded-lg px-4 py-2 text-center min-w-[70px]">
                    <p className="text-xs opacity-70">Quarter</p>
                    <p className="text-base font-bold">{report.quarter}</p>
                  </div>

                  {/* Report Details */}
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {report.quarter} Report
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Generated on {report.date}
                    </p>
                    <div className="flex gap-4 mt-2">
                      <span className="text-xs text-green-600">
                        Inflow: ${report.inflow.toLocaleString()}
                      </span>
                      <span className="text-xs text-red-500">
                        Outflow: ${report.outflow.toLocaleString()}
                      </span>
                      <span className="text-xs text-blue-600">
                        Net Worth: ${report.grandTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <span className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full font-medium">
                    ✓ {report.status}
                  </span>
                  <button className="text-sm text-blue-700 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition">
                    ⬇ SACS
                  </button>
                  <button className="text-sm text-blue-700 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition">
                    ⬇ TCC
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

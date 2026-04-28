import { useNavigate, useParams } from "react-router-dom";

const mockClient = {
  id: 1,
  client1FirstName: "John",
  client1LastName: "Smith",
  client1DOB: "1970-03-15",
  client1SSN: "1234",
  hasSpouse: true,
  client2FirstName: "Jane",
  client2LastName: "Smith",
  client2DOB: "1972-07-22",
  client2SSN: "5678",
  monthlyInflow: 15000,
  monthlyOutflow: 11000,
  privateReserveTarget: 66000,
  retirementAccounts: [
    { type: "IRA", owner: "client1", lastFour: "1111" },
    { type: "Roth IRA", owner: "client1", lastFour: "2222" },
    { type: "401K", owner: "client2", lastFour: "3333" },
  ],
  nonRetirementAccounts: [
    { type: "Brokerage", lastFour: "4444" },
    { type: "Joint", lastFour: "5555" },
  ],
  liabilities: [{ type: "Mortgage", interestRate: "3.5", balance: 200000 }],
  hasTrust: true,
  propertyAddress: "123 Main St, Atlanta, GA",
  lastReport: "2024-12-01",
};

export default function ClientProfile() {
  const navigate = useNavigate();
  const { id } = useParams();

  const age1 =
    new Date().getFullYear() - new Date(mockClient.client1DOB).getFullYear();
  const age2 =
    new Date().getFullYear() - new Date(mockClient.client2DOB).getFullYear();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-xl font-bold text-blue-900">
              {mockClient.client1FirstName} & {mockClient.client2FirstName}{" "}
              {mockClient.client1LastName}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Last report: {mockClient.lastReport}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/client/${id}/history`)}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition"
          >
            Report History
          </button>
          <button
            onClick={() => navigate(`/client/${id}/generate-report`)}
            className="px-4 py-2 rounded-lg bg-blue-700 text-white text-sm font-medium hover:bg-blue-800 transition"
          >
            Generate Report
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-10 flex flex-col gap-6">
        {/* Client Info Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Client 1 */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-blue-900 uppercase tracking-wide mb-4">
              Client 1
            </h2>
            <div className="flex flex-col gap-2">
              <Row
                label="Name"
                value={`${mockClient.client1FirstName} ${mockClient.client1LastName}`}
              />
              <Row label="Date of Birth" value={mockClient.client1DOB} />
              <Row label="Age" value={`${age1}`} />
              <Row
                label="SSN (last 4)"
                value={`••••${mockClient.client1SSN}`}
              />
            </div>
          </div>

          {/* Client 2 */}
          {mockClient.hasSpouse && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-blue-900 uppercase tracking-wide mb-4">
                Client 2
              </h2>
              <div className="flex flex-col gap-2">
                <Row
                  label="Name"
                  value={`${mockClient.client2FirstName} ${mockClient.client2LastName}`}
                />
                <Row label="Date of Birth" value={mockClient.client2DOB} />
                <Row label="Age" value={`${age2}`} />
                <Row
                  label="SSN (last 4)"
                  value={`••••${mockClient.client2SSN}`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Monthly Financials */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-blue-900 uppercase tracking-wide mb-4">
            Monthly Financials
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <FinCard
              label="Monthly Inflow"
              value={`$${mockClient.monthlyInflow.toLocaleString()}`}
              color="green"
            />
            <FinCard
              label="Monthly Outflow"
              value={`$${mockClient.monthlyOutflow.toLocaleString()}`}
              color="red"
            />
            <FinCard
              label="Private Reserve Target"
              value={`$${mockClient.privateReserveTarget.toLocaleString()}`}
              color="blue"
            />
          </div>
        </div>

        {/* Accounts */}
        <div className="grid grid-cols-2 gap-4">
          {/* Retirement */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-blue-900 uppercase tracking-wide mb-4">
              Retirement Accounts
            </h2>
            <div className="flex flex-col gap-2">
              {mockClient.retirementAccounts.map((acc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-600">
                    {acc.type}{" "}
                    <span className="text-gray-400">••{acc.lastFour}</span>
                  </span>
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    {acc.owner === "client1"
                      ? mockClient.client1FirstName
                      : mockClient.client2FirstName}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Non-Retirement */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-blue-900 uppercase tracking-wide mb-4">
              Non-Retirement Accounts
            </h2>
            <div className="flex flex-col gap-2">
              {mockClient.nonRetirementAccounts.map((acc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-600">
                    {acc.type}{" "}
                    <span className="text-gray-400">••{acc.lastFour}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust & Liabilities */}
        <div className="grid grid-cols-2 gap-4">
          {mockClient.hasTrust && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-blue-900 uppercase tracking-wide mb-4">
                Trust
              </h2>
              <Row
                label="Property Address"
                value={mockClient.propertyAddress}
              />
            </div>
          )}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-blue-900 uppercase tracking-wide mb-4">
              Liabilities
            </h2>
            {mockClient.liabilities.map((lib, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-600">{lib.type}</span>
                <span className="text-gray-400">
                  {lib.interestRate}% interest
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-700 font-medium">{value}</span>
    </div>
  );
}

function FinCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: "green" | "red" | "blue";
}) {
  const colors = {
    green: "bg-green-50 text-green-700",
    red: "bg-red-50 text-red-700",
    blue: "bg-blue-50 text-blue-700",
  };
  return (
    <div className={`rounded-xl p-4 ${colors[color]}`}>
      <p className="text-xs font-medium opacity-70">{label}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );
}

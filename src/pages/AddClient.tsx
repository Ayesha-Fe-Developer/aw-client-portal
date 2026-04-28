import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddClient() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Client 1
    client1FirstName: "",
    client1LastName: "",
    client1DOB: "",
    client1SSN: "",
    // Client 2 (spouse)
    hasSpouse: false,
    client2FirstName: "",
    client2LastName: "",
    client2DOB: "",
    client2SSN: "",
    // Financial
    monthlyInflow: "",
    monthlyOutflow: "",
    privateReserveTarget: "",
    // Accounts
    retirementAccounts: [{ type: "IRA", owner: "client1", lastFour: "" }],
    nonRetirementAccounts: [{ type: "Brokerage", lastFour: "" }],
    liabilities: [{ type: "Mortgage", interestRate: "", balance: "" }],
    // Trust
    hasTrust: false,
    propertyAddress: "",
  });

  const handle = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-5 flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="text-gray-400 hover:text-gray-600 text-sm"
        >
          ← Back
        </button>
        <div>
          <h1 className="text-xl font-bold text-blue-900">Add New Client</h1>
          <p className="text-sm text-gray-400">
            Enter static client info once — reused every quarter
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-10 flex flex-col gap-8">
        {/* Client 1 */}
        <section className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-base font-semibold text-blue-900 mb-4">
            Client 1
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">First Name</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 text-sm"
                value={formData.client1FirstName}
                onChange={(e) => handle("client1FirstName", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-gray-500">Last Name</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 text-sm"
                value={formData.client1LastName}
                onChange={(e) => handle("client1LastName", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-gray-500">Date of Birth</label>
              <input
                type="date"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 text-sm"
                value={formData.client1DOB}
                onChange={(e) => handle("client1DOB", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-gray-500">Last 4 of SSN</label>
              <input
                maxLength={4}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 text-sm"
                value={formData.client1SSN}
                onChange={(e) => handle("client1SSN", e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Spouse Toggle */}
        <section className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-blue-900">
              Client 2 (Spouse)
            </h2>
            <button
              onClick={() => handle("hasSpouse", !formData.hasSpouse)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${formData.hasSpouse ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-500"}`}
            >
              {formData.hasSpouse ? "Added" : "+ Add Spouse"}
            </button>
          </div>
          {formData.hasSpouse && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm text-gray-500">First Name</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 text-sm"
                  value={formData.client2FirstName}
                  onChange={(e) => handle("client2FirstName", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Last Name</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 text-sm"
                  value={formData.client2LastName}
                  onChange={(e) => handle("client2LastName", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Date of Birth</label>
                <input
                  type="date"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 text-sm"
                  value={formData.client2DOB}
                  onChange={(e) => handle("client2DOB", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Last 4 of SSN</label>
                <input
                  maxLength={4}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 text-sm"
                  value={formData.client2SSN}
                  onChange={(e) => handle("client2SSN", e.target.value)}
                />
              </div>
            </div>
          )}
        </section>

        {/* Financial Info */}
        <section className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-base font-semibold text-blue-900 mb-4">
            Monthly Financials
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">
                Monthly Inflow (after tax)
              </label>
              <input
                type="number"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 text-sm"
                value={formData.monthlyInflow}
                onChange={(e) => handle("monthlyInflow", e.target.value)}
                placeholder="e.g. 15000"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500">
                Monthly Outflow (expense budget)
              </label>
              <input
                type="number"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 text-sm"
                value={formData.monthlyOutflow}
                onChange={(e) => handle("monthlyOutflow", e.target.value)}
                placeholder="e.g. 11000"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500">
                Private Reserve Target
              </label>
              <input
                type="number"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 text-sm"
                value={formData.privateReserveTarget}
                onChange={(e) => handle("privateReserveTarget", e.target.value)}
                placeholder="e.g. 66000"
              />
            </div>
          </div>
        </section>

        {/* Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2 rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button className="px-5 py-2 rounded-lg bg-blue-700 text-white text-sm font-medium hover:bg-blue-800 transition">
            Save Client
          </button>
        </div>
      </div>
    </div>
  );
}

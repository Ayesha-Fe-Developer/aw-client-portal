import { useState } from "react";
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
  liabilities: [{ type: "Mortgage", interestRate: "3.5" }],
  hasTrust: true,
  propertyAddress: "123 Main St, Atlanta, GA",
};

export default function GenerateReport() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [balances, setBalances] = useState<Record<string, string>>({});

  const setBalance = (key: string, value: string) => {
    setBalances((prev) => ({ ...prev, [key]: value }));
  };

  const getVal = (key: string) => parseFloat(balances[key] || "0") || 0;

  // ── SACS Calculations ──
  const inflow = mockClient.monthlyInflow;
  const outflow = mockClient.monthlyOutflow;
  const excess = inflow - outflow;
  const privateReserveBalance = getVal("privateReserve");

  // ── TCC Calculations ──
  const client1RetirementTotal = mockClient.retirementAccounts
    .filter((a) => a.owner === "client1")
    .reduce((sum, a) => sum + getVal(`retirement_${a.lastFour}`), 0);

  const client2RetirementTotal = mockClient.retirementAccounts
    .filter((a) => a.owner === "client2")
    .reduce((sum, a) => sum + getVal(`retirement_${a.lastFour}`), 0);

  const nonRetirementTotal = mockClient.nonRetirementAccounts.reduce(
    (sum, a) => sum + getVal(`nonretirement_${a.lastFour}`),
    0,
  );

  const trustValue = getVal("trust");

  const grandTotal =
    client1RetirementTotal +
    client2RetirementTotal +
    nonRetirementTotal +
    trustValue;

  const liabilitiesTotal = mockClient.liabilities.reduce(
    (sum, a) => sum + getVal(`liability_${a.type}`),
    0,
  );

  const allSACSFilled =
    balances["privateReserve"] !== undefined &&
    balances["privateReserve"] !== "";
  const allTCCFilled = [
    ...mockClient.retirementAccounts.map((a) => `retirement_${a.lastFour}`),
    ...mockClient.nonRetirementAccounts.map(
      (a) => `nonretirement_${a.lastFour}`,
    ),
    ...mockClient.liabilities.map((a) => `liability_${a.type}`),
    "trust",
  ].every((key) => balances[key] !== undefined && balances[key] !== "");

  const canGenerate = allSACSFilled && allTCCFilled;

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
            <h1 className="text-xl font-bold text-blue-900">Generate Report</h1>
            <p className="text-sm text-gray-400">
              {mockClient.client1FirstName} & {mockClient.client2FirstName}{" "}
              {mockClient.client1LastName} — Q
              {Math.ceil((new Date().getMonth() + 1) / 3)}{" "}
              {new Date().getFullYear()}
            </p>
          </div>
        </div>
        <button
          disabled={!canGenerate}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition ${canGenerate ? "bg-blue-700 text-white hover:bg-blue-800" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
        >
          Generate PDFs
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-10 flex flex-col gap-8">
        {/* SACS Section */}
        <section className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-blue-900">
                SACS — Cash Flow
              </h2>
              <p className="text-sm text-gray-400 mt-0.5">
                Simple Automated Cash Flow System
              </p>
            </div>
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium ${allSACSFilled ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}`}
            >
              {allSACSFilled ? "✓ Complete" : "Incomplete"}
            </span>
          </div>

          {/* Pre-filled fields */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <PrefilledField
              label="Monthly Inflow"
              value={`$${inflow.toLocaleString()}`}
            />
            <PrefilledField
              label="Monthly Outflow"
              value={`$${outflow.toLocaleString()}`}
            />
            <PrefilledField
              label="Excess (auto-calculated)"
              value={`$${excess.toLocaleString()}`}
              highlight
            />
          </div>

          {/* Dynamic fields */}
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Private Reserve Balance"
              fieldKey="privateReserve"
              balances={balances}
              setBalance={setBalance}
              placeholder="Enter current balance"
            />
          </div>

          {/* Private Reserve summary */}
          {privateReserveBalance > 0 && (
            <div className="mt-4 bg-blue-50 rounded-lg p-4 flex items-center justify-between">
              <span className="text-sm text-blue-700">
                Private Reserve vs Target
              </span>
              <span className="text-sm font-semibold text-blue-900">
                ${privateReserveBalance.toLocaleString()} / $
                {mockClient.privateReserveTarget.toLocaleString()}
              </span>
            </div>
          )}
        </section>

        {/* TCC Section */}
        <section className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-blue-900">
                TCC — Net Worth
              </h2>
              <p className="text-sm text-gray-400 mt-0.5">Total Client Chart</p>
            </div>
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium ${allTCCFilled ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}`}
            >
              {allTCCFilled ? "✓ Complete" : "Incomplete"}
            </span>
          </div>

          {/* Client 1 Retirement */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">
              {mockClient.client1FirstName}'s Retirement Accounts
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {mockClient.retirementAccounts
                .filter((a) => a.owner === "client1")
                .map((acc, i) => (
                  <InputField
                    key={i}
                    label={`${acc.type} ••${acc.lastFour}`}
                    fieldKey={`retirement_${acc.lastFour}`}
                    balances={balances}
                    setBalance={setBalance}
                    placeholder="Enter balance"
                  />
                ))}
            </div>
            {client1RetirementTotal > 0 && (
              <div className="mt-3 bg-gray-50 rounded-lg px-4 py-2 flex justify-between text-sm">
                <span className="text-gray-500">
                  {mockClient.client1FirstName} Retirement Total
                </span>
                <span className="font-semibold text-gray-800">
                  ${client1RetirementTotal.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Client 2 Retirement */}
          {mockClient.hasSpouse && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                {mockClient.client2FirstName}'s Retirement Accounts
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {mockClient.retirementAccounts
                  .filter((a) => a.owner === "client2")
                  .map((acc, i) => (
                    <InputField
                      key={i}
                      label={`${acc.type} ••${acc.lastFour}`}
                      fieldKey={`retirement_${acc.lastFour}`}
                      balances={balances}
                      setBalance={setBalance}
                      placeholder="Enter balance"
                    />
                  ))}
              </div>
              {client2RetirementTotal > 0 && (
                <div className="mt-3 bg-gray-50 rounded-lg px-4 py-2 flex justify-between text-sm">
                  <span className="text-gray-500">
                    {mockClient.client2FirstName} Retirement Total
                  </span>
                  <span className="font-semibold text-gray-800">
                    ${client2RetirementTotal.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Non-Retirement */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">
              Non-Retirement Accounts
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {mockClient.nonRetirementAccounts.map((acc, i) => (
                <InputField
                  key={i}
                  label={`${acc.type} ••${acc.lastFour}`}
                  fieldKey={`nonretirement_${acc.lastFour}`}
                  balances={balances}
                  setBalance={setBalance}
                  placeholder="Enter balance"
                />
              ))}
            </div>
            {nonRetirementTotal > 0 && (
              <div className="mt-3 bg-gray-50 rounded-lg px-4 py-2 flex justify-between text-sm">
                <span className="text-gray-500">Non-Retirement Total</span>
                <span className="font-semibold text-gray-800">
                  ${nonRetirementTotal.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Trust */}
          {mockClient.hasTrust && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Trust</h3>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label={`Zillow Value — ${mockClient.propertyAddress}`}
                  fieldKey="trust"
                  balances={balances}
                  setBalance={setBalance}
                  placeholder="Enter Zillow Zestimate"
                />
              </div>
            </div>
          )}

          {/* Liabilities */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">
              Liabilities
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {mockClient.liabilities.map((lib, i) => (
                <InputField
                  key={i}
                  label={`${lib.type} (${lib.interestRate}% interest)`}
                  fieldKey={`liability_${lib.type}`}
                  balances={balances}
                  setBalance={setBalance}
                  placeholder="Enter balance"
                />
              ))}
            </div>
            {liabilitiesTotal > 0 && (
              <div className="mt-3 bg-gray-50 rounded-lg px-4 py-2 flex justify-between text-sm">
                <span className="text-gray-500">
                  Liabilities Total (not subtracted from net worth)
                </span>
                <span className="font-semibold text-red-600">
                  ${liabilitiesTotal.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Grand Total */}
          {grandTotal > 0 && (
            <div className="bg-blue-700 rounded-xl px-6 py-4 flex justify-between items-center">
              <span className="text-white font-medium">
                Grand Total Net Worth
              </span>
              <span className="text-white text-xl font-bold">
                ${grandTotal.toLocaleString()}
              </span>
            </div>
          )}
        </section>

        {/* Generate Button */}
        <div className="flex justify-end">
          <button
            disabled={!canGenerate}
            className={`px-6 py-3 rounded-xl text-sm font-semibold transition ${canGenerate ? "bg-blue-700 text-white hover:bg-blue-800" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
          >
            {canGenerate
              ? "⬇ Generate & Download PDFs"
              : "Fill all fields to generate"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PrefilledField({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg px-4 py-3 ${highlight ? "bg-blue-50" : "bg-gray-50"}`}
    >
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p
        className={`text-sm font-semibold ${highlight ? "text-blue-700" : "text-gray-700"}`}
      >
        {value}
      </p>
    </div>
  );
}

function InputField({
  label,
  fieldKey,
  balances,
  setBalance,
  placeholder,
}: {
  label: string;
  fieldKey: string;
  balances: Record<string, string>;
  setBalance: (key: string, value: string) => void;
  placeholder: string;
}) {
  const isFilled =
    balances[fieldKey] !== undefined && balances[fieldKey] !== "";
  return (
    <div>
      <label className="text-xs text-gray-500 mb-1 block">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
          $
        </span>
        <input
          type="number"
          value={balances[fieldKey] || ""}
          onChange={(e) => setBalance(fieldKey, e.target.value)}
          placeholder={placeholder}
          className={`w-full border rounded-lg pl-7 pr-3 py-2 text-sm transition ${isFilled ? "border-green-300 bg-green-50" : "border-gray-200 bg-white"}`}
        />
      </div>
    </div>
  );
}

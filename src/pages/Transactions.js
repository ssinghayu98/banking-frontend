import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  // ✅ FINAL CORRECT BACKEND URL (FROM YOUR RAILWAY)
  const BASE_URL = "https://banking-app-production-54bc.up.railway.app";

  useEffect(() => {
    if (!username) {
      navigate("/");
      return;
    }

    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const url = `${BASE_URL}/api/user/transactions?username=${username}`;
      console.log("🚀 Calling API:", url);

      const res = await fetch(url);

      // 🔥 Proper error handling
      if (!res.ok) {
        const text = await res.text();
        console.error("❌ API ERROR:", res.status, text);
        setTransactions([]);
        return;
      }

      const data = await res.json();
      console.log("✅ API RESPONSE:", data);

      // ✅ Safe extraction
      const list = Array.isArray(data?.data) ? data.data : [];

      // ✅ Do NOT mutate original array
      setTransactions([...list].reverse());

    } catch (err) {
      console.error("❌ FETCH ERROR:", err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const getColor = (type) => {
    if (type === "DEPOSIT") return "text-green-600";
    if (type === "WITHDRAW") return "text-red-600";
    return "text-indigo-600";
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl font-semibold">
        ⏳ Loading Transactions...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-indigo-100 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📜 All Transactions</h1>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          ← Back
        </button>
      </div>

      {/* EMPTY STATE */}
      {transactions.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No transactions found
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

          {transactions.map((t, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition"
            >
              {/* TYPE */}
              <h3 className={`font-semibold text-lg ${getColor(t.type)}`}>
                {t.type}
              </h3>

              {/* AMOUNT */}
              <p className="text-xl font-bold mt-2">
                ₹ {t.amount}
              </p>

              {/* TRANSFER DETAILS */}
              {(t.sender || t.receiver) && (
                <p className="text-sm text-gray-500 mt-1">
                  {t.sender || "System"} → {t.receiver || "System"}
                </p>
              )}

              {/* TIMESTAMP */}
              <p className="text-xs text-gray-400 mt-2">
                {t.timestamp
                  ? new Date(t.timestamp).toLocaleString()
                  : "No time"}
              </p>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default Transactions;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  // ✅ IMPORTANT: replace with your actual Railway backend URL
  const BASE_URL = "https://your-app-name.up.railway.app";

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

      const res = await fetch(
        `${BASE_URL}/api/user/transactions?username=${username}`
      );

      // 🔥 handle backend errors properly
      if (!res.ok) {
        console.error("API Error:", res.status);
        setTransactions([]);
        return;
      }

      const data = await res.json();

      console.log("Transactions API:", data);

      // ✅ correct extraction from ApiResponse
      const list = Array.isArray(data?.data) ? data.data : [];

      // ✅ latest first (without mutating original)
      setTransactions([...list].reverse());

    } catch (err) {
      console.error("Fetch error:", err);
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

              {/* TIME */}
              <p className="text-xs text-gray-400 mt-2">
                {new Date(t.timestamp).toLocaleString()}
              </p>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default Transactions;
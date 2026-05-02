import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Admin() {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchTransactions()]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:8080/admin/users");
      const data = await res.json();

      // ✅ FIX: backend returns array directly
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setUsers([]);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch("http://localhost:8080/admin/transactions");
      const data = await res.json();

      const list = Array.isArray(data) ? data : [];

      // 🔥 latest first
      setTransactions(list.reverse());
    } catch (err) {
      console.error(err);
      setTransactions([]);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl font-semibold">
        ⏳ Loading Admin Panel...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-indigo-100 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          👑 Admin Panel
        </h1>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
        >
          Back
        </button>
      </div>

      {/* USERS */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">All Users</h2>

        {users.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No users found</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {users.map((u, i) => (
              <div
                key={i}
                className="border p-4 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <p className="font-semibold text-lg">{u.username}</p>
                <p className="text-gray-500">Balance</p>
                <p className="font-bold text-indigo-600 text-xl">
                  ₹ {u.balance}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TRANSACTIONS */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-4">All Transactions</h2>

        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No transactions found
          </p>
        ) : (
          <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
            {transactions.map((t, i) => (
              <div
                key={i}
                className="border p-4 rounded-lg flex justify-between items-center hover:bg-gray-50 transition"
              >
                <div>
                  <p className="font-semibold text-lg">{t.type}</p>

                  {(t.sender || t.receiver) && (
                    <p className="text-sm text-gray-500">
                      {t.sender || "System"} → {t.receiver || "System"}
                    </p>
                  )}

                  <p className="text-xs text-gray-400">
                    {new Date(t.timestamp).toLocaleString()}
                  </p>
                </div>

                <p className="font-bold text-indigo-600 text-lg">
                  ₹ {t.amount}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
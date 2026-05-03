import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api"; // ✅ FIXED

function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!username) {
      navigate("/");
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchBalance(), fetchTransactions()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async () => {
    try {
      const res = await fetch(`${API_URL}/api/user/balance?username=${username}`);
      const data = await res.json();
      setBalance(data?.data ?? 0);
    } catch (err) {
      console.error("Balance error:", err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${API_URL}/api/user/transactions?username=${username}`);
      const data = await res.json();
      const list = Array.isArray(data?.data) ? data.data : [];
      setTransactions(list.slice(-5).reverse());
    } catch (err) {
      console.error("Transaction error:", err);
    }
  };

  const deposit = async () => {
    if (!amount) return;

    setActionLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/user/deposit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username, // ✅ IMPORTANT
          amount: Number(amount),
        }),
      });

      const data = await res.json();

      console.log("DEPOSIT RESPONSE:", data);

      if (!res.ok) {
        throw new Error(data?.message || "Deposit failed");
      }

      setAmount("");
      await loadData();

    } catch (err) {
      console.error("Deposit error:", err);
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const withdraw = async () => {
    if (!amount) return;

    setActionLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/user/withdraw`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          amount: Number(amount),
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.message);

      setAmount("");
      await loadData();

    } catch (err) {
      console.error("Withdraw error:", err);
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const transfer = async () => {
    if (!transferAmount || !transferTo) return;

    setActionLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/user/transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: username,
          receiver: transferTo,
          amount: Number(transferAmount),
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.message);

      setTransferAmount("");
      setTransferTo("");
      await loadData();

    } catch (err) {
      console.error("Transfer error:", err);
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-6 text-white">

      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">🏦 Bankify</h1>

        <div className="flex gap-3">
          {role === "admin" && (
            <button onClick={() => navigate("/admin")}
              className="bg-white/10 px-4 py-2 rounded-xl">
              Admin
            </button>
          )}

          <button onClick={() => navigate("/transactions")}
            className="bg-indigo-500 px-4 py-2 rounded-xl">
            Transactions
          </button>

          <button onClick={logout}
            className="bg-red-500 px-4 py-2 rounded-xl">
            Logout
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 rounded-3xl mb-8">
        <p>Welcome back</p>
        <h2>{username}</h2>
        <h1 className="text-5xl mt-4">₹ {balance}</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">

        <div className="bg-white/10 p-6 rounded-2xl">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 rounded text-black mb-4"
          />

          <div className="flex gap-4">
            <button onClick={deposit}
              className="flex-1 bg-green-500 py-2 rounded">
              Deposit
            </button>

            <button onClick={withdraw}
              className="flex-1 bg-yellow-500 py-2 rounded">
              Withdraw
            </button>
          </div>
        </div>

        <div className="bg-white/10 p-6 rounded-2xl">
          <input
            placeholder="Receiver"
            value={transferTo}
            onChange={(e) => setTransferTo(e.target.value)}
            className="w-full p-3 rounded text-black mb-3"
          />

          <input
            type="number"
            placeholder="Amount"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
            className="w-full p-3 rounded text-black mb-3"
          />

          <button onClick={transfer}
            className="w-full bg-indigo-500 py-2 rounded">
            Send Money
          </button>
        </div>
      </div>

      <div className="bg-white/10 p-6 rounded-2xl">
        <h3 className="mb-4">Recent Transactions</h3>

        {transactions.map((t, i) => (
          <div key={i} className="flex justify-between mb-2">
            <span>{t.type}</span>
            <span>₹{t.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
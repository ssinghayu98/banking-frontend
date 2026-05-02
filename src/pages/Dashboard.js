import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");
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
    const res = await fetch(`http://localhost:8080/user/balance?username=${username}`);
    const data = await res.json();
    setBalance(data?.data ?? 0);
  };

  const fetchTransactions = async () => {
    const res = await fetch(`http://localhost:8080/user/transactions?username=${username}`);
    const data = await res.json();
    const list = Array.isArray(data?.data) ? data.data : [];
    setTransactions(list.slice(-5).reverse());
  };

  const deposit = async () => {
    if (!amount) return;
    setActionLoading(true);
    await fetch("http://localhost:8080/user/deposit", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ username, amount: Number(amount) })
    });
    setAmount("");
    loadData();
    setActionLoading(false);
  };

  const withdraw = async () => {
    if (!amount) return;
    setActionLoading(true);
    await fetch("http://localhost:8080/user/withdraw", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ username, amount: Number(amount) })
    });
    setAmount("");
    loadData();
    setActionLoading(false);
  };

  const transfer = async () => {
    if (!transferAmount || !transferTo) return;
    setActionLoading(true);
    await fetch("http://localhost:8080/user/transfer", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        sender: username,
        receiver: transferTo,
        amount: Number(transferAmount)
      })
    });
    setTransferAmount("");
    setTransferTo("");
    loadData();
    setActionLoading(false);
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-xl">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-6 text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold tracking-wide">🏦 Bankify</h1>

        <div className="flex gap-3">
          {role === "admin" && (
            <button onClick={() => navigate("/admin")}
              className="bg-white/10 backdrop-blur px-4 py-2 rounded-xl hover:bg-white/20">
              Admin
            </button>
          )}

          <button onClick={() => navigate("/transactions")}
            className="bg-indigo-500 px-4 py-2 rounded-xl hover:bg-indigo-600">
            Transactions
          </button>

          <button onClick={logout}
            className="bg-red-500 px-4 py-2 rounded-xl hover:bg-red-600">
            Logout
          </button>
        </div>
      </div>

      {/* BALANCE CARD */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 rounded-3xl shadow-2xl mb-8 transform hover:scale-[1.02] transition">
        <p className="opacity-80">Welcome back</p>
        <h2 className="text-xl">{username}</h2>

        <h1 className="text-6xl font-bold mt-4">₹ {balance}</h1>
        <p className="opacity-80 mt-2">Available Balance</p>
      </div>

      {/* ACTIONS */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">

        <div className="bg-white/10 backdrop-blur p-6 rounded-2xl shadow-lg">
          <h3 className="mb-4 font-semibold">Quick Actions</h3>

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e)=>setAmount(e.target.value)}
            className="w-full p-3 rounded-lg text-black mb-4"
          />

          <div className="flex gap-4">
            <button onClick={deposit}
              className="flex-1 bg-green-500 py-2 rounded-lg hover:scale-105 transition">
              Deposit
            </button>

            <button onClick={withdraw}
              className="flex-1 bg-yellow-500 py-2 rounded-lg hover:scale-105 transition">
              Withdraw
            </button>
          </div>
        </div>

        {/* TRANSFER */}
        <div className="bg-white/10 backdrop-blur p-6 rounded-2xl shadow-lg">
          <h3 className="mb-4 font-semibold">Transfer</h3>

          <input
            placeholder="Receiver"
            value={transferTo}
            onChange={(e)=>setTransferTo(e.target.value)}
            className="w-full p-3 rounded-lg text-black mb-3"
          />

          <input
            type="number"
            placeholder="Amount"
            value={transferAmount}
            onChange={(e)=>setTransferAmount(e.target.value)}
            className="w-full p-3 rounded-lg text-black mb-3"
          />

          <button onClick={transfer}
            className="w-full bg-indigo-500 py-2 rounded-lg hover:scale-105 transition">
            Send Money
          </button>
        </div>
      </div>

      {/* TRANSACTIONS */}
      <div className="bg-white/10 backdrop-blur p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between mb-4">
          <h3 className="font-semibold">Recent Transactions</h3>
          <button onClick={()=>navigate("/transactions")}
            className="text-indigo-300 hover:underline">
            View All →
          </button>
        </div>

        <div className="space-y-3">
          {transactions.map((t,i)=>(
            <div key={i}
              className="flex justify-between p-4 bg-white/10 rounded-lg hover:bg-white/20 transition">
              <div>
                <p className="font-semibold">{t.type}</p>
                <p className="text-sm opacity-70">
                  {new Date(t.timestamp).toLocaleString()}
                </p>
              </div>
              <p className="font-bold text-lg">₹{t.amount}</p>
            </div>
          ))}
        </div>
      </div>

      {message && (
        <p className="text-center mt-6 text-green-400">{message}</p>
      )}
    </div>
  );
}

export default Dashboard;
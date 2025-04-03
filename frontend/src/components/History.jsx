//component/History.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, BarChart3 } from "lucide-react";
import formatDate from "../utils/formatDate";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";
const statsBaseUrl = import.meta.env.VITE_STATS_BASE_URL || "http://localhost:5002";

export default function History({ onViewStats }) {
  const [sortBy, setSortBy] = useState("createdAt");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const res = await axios.get(`${apiBaseUrl}/history`);
    setHistory(res.data);
  };

  const handleDelete = async (code) => {
    await axios.delete(`${apiBaseUrl}/delete/${code}`);
    fetchHistory();
  };

  const handleViewStats = async (code) => {
    const res = await axios.get(`${statsBaseUrl}/stats/${code}`);
    onViewStats(res.data.history);
  };

  const sortedHistory = [...history].sort((a, b) => {
    if (sortBy === "createdAt") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === "expiresAt") {
      return new Date(a.expiresAt || 0) - new Date(b.expiresAt || 0);
    }
    return 0;
  });

  if (!history.length) return null;

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-100">History</h2>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="createdAt">Sort by Created</option>
          <option value="expiresAt">Sort by Expiry</option>
        </select>
      </div>
      <ul className="space-y-2 max-h-60 overflow-auto">
        {sortedHistory.map((item, idx) => (
          <li
            key={idx}
            className="p-3 bg-gray-50 dark:bg-gray-700 border rounded-xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
          >
            <div className="min-w-0">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {formatDate(item.createdAt)}
              </p>
              <a
                href={item.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 break-all hover:underline"
              >
                {item.shortUrl}
              </a>
              <p className="text-xs text-gray-500 truncate">{item.fullUrl}</p>
              {item.expiresAt && (
                <p className="text-xs text-gray-400">
                  Expires: {formatDate(item.expiresAt)}
                </p>
              )}
            </div>
            <div className="flex gap-3 items-start sm:items-center">
              <button
                onClick={() => handleViewStats(item.code)}
                className="text-blue-500 hover:text-blue-600"
                title="View Stats"
              >
                <BarChart3 size={18} />
              </button>
              <button
                onClick={() => handleDelete(item.code)}
                className="text-red-500 hover:text-red-600"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

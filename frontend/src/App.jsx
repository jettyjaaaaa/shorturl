import { useState, useEffect } from "react";
import Shortener from "./components/Shortener";
import Stats from "./components/Stats";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import History from "./components/History";
import formatDate from "./utils/formatDate";
import { FileText, BarChart3, Link2, X } from "lucide-react";

export default function App() {
  const [shortUrl, setShortUrl] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [stats, setStats] = useState([]);
  const [expires, setExpires] = useState(null);
  const [tab, setTab] = useState("shorten");
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const handleViewStats = (historyData) => {
    setStats(historyData);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300 p-6">
      <div className="max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setTab("shorten")}
              className={`flex items-center gap-1 px-4 py-2 rounded-xl transition-all ${tab === "shorten" ? "bg-blue-600 text-white" : "bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200 border"}`}
            >
              <Link2 size={16} /> Shorten
            </button>
            
            <button
              onClick={() => setTab("history")}
              className={`flex items-center gap-1 px-4 py-2 rounded-xl transition-all ${tab === "history" ? "bg-blue-600 text-white" : "bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200 border"}`}
            >
              <FileText size={16} /> History
            </button>
          </div>
          <button
            onClick={() => setIsDark(!isDark)}
            className="text-sm px-3 py-1 rounded-xl border bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition"
          >
            {isDark ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl transition-all">
          {tab === "shorten" && (
            <>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
                <Link2 size={22} /> URL Shortener
              </h1>
              <Shortener
                setStats={setStats}
                setShortUrl={setShortUrl}
                setQrCode={setQrCode}
                setExpires={setExpires}
              />
              {shortUrl && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 border rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-200">Short URL:</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(shortUrl)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Copy
                    </button>
                  </div>
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 break-words"
                  >
                    {shortUrl}
                  </a>
                  {expires && (
                    <p className="text-sm text-gray-500">Expires: {formatDate(expires)}</p>
                  )}
                  {qrCode && (
                    <div className="mt-4 text-center">
                      <img
                        src={qrCode}
                        alt="QR Code"
                        className="inline-block w-40 h-40 border rounded-lg"
                      />
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          

          {tab === "history" && (
            <>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
                <FileText size={22} /> History
              </h1>
              <History onViewStats={handleViewStats} />
            </>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full relative shadow-xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-white"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Click Stats</h2>
            <Stats stats={stats} />
          </div>
        </div>
      )}
    </div>
  );
}

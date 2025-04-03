import { useState } from "react";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";
const qrUrl = import.meta.env.VITE_QR_BASE_URL || "http://localhost:5003";
const statsUrl = import.meta.env.VITE_STATS_BASE_URL || "http://localhost:5002";

export default function Shortener({ setStats, setShortUrl, setQrCode, setExpires }) {
  const [fullUrl, setFullUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleShorten = async () => {
    try {
      setIsLoading(true);
      setShortUrl(null);
      setQrCode(null);

      let expiryDate = expiresAt;
      if (!expiresAt) {
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 7);
        expiryDate = defaultDate.toISOString().slice(0, 10);
      }

      const res = await axios.post(`${baseUrl}/shorten`, {
        fullUrl,
        customCode: customCode || undefined,
        expiresAt: expiryDate,
      });

      const newShortUrl = res.data.shortUrl;
      setShortUrl(newShortUrl);
      setExpires(expiryDate);

      const code = customCode || newShortUrl.split("/").pop();

      const qr = await axios.get(`${qrUrl}/qrcode/${code}`);
      setQrCode(qr.data.qrCode);

      const statRes = await axios.get(`${statsUrl}/stats/${code}`);
      setStats(statRes.data.history);
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="url"
        placeholder="Enter full URL"
        value={fullUrl}
        onChange={(e) => setFullUrl(e.target.value)}
        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="text"
        placeholder="Custom alias (optional)"
        value={customCode}
        onChange={(e) => setCustomCode(e.target.value)}
        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="date"
        value={expiresAt}
        onChange={(e) => setExpiresAt(e.target.value)}
        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={handleShorten}
        disabled={isLoading || !fullUrl}
        className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
      >
        {isLoading ? "Processing..." : "Create Short URL"}
      </button>
    </div>
  );
}

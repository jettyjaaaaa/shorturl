import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Stats({ stats }) {
  if (!stats.length) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        There are no clicks on this link yet.
      </div>
    );
  }

  // Group by day
  const grouped = stats.reduce((acc, curr) => {
    const date = new Date(curr.timestamp).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(grouped).map(([name, value]) => ({ name, value }));

  const latestDate = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a))[0];
  const latestTotal = grouped[latestDate];

  return (
<div>
  <p className="text-sm text-right text-gray-600 dark:text-gray-300 mb-2">
    Latest clicks ({latestDate}): {latestTotal} Times
  </p>
  <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="value" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
</div>
);
}

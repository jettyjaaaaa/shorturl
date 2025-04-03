export default function formatDate(dateStr) {
    if (!dateStr) return null;
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  }
/**
 * Export utility for Expenso
 * Provides CSV export functionality for expense data.
 */

/**
 * Converts an array of expense objects to a CSV string.
 * @param {Array} expenses - Array of expense objects
 * @returns {string} CSV formatted string
 */
export const expensesToCsv = (expenses) => {
  if (!expenses || expenses.length === 0) return '';

  const headers = ['Title', 'Category', 'Amount', 'Date', 'Note'];
  const rows = expenses.map(exp => [
    `"${(exp.title || '').replace(/"/g, '""')}"`,
    `"${(exp.category || '').replace(/"/g, '""')}"`,
    exp.amount || 0,
    exp.date ? new Date(exp.date).toLocaleString('en-IN') : '',
    `"${(exp.note || '').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
};

/**
 * Triggers a CSV file download in the browser.
 * @param {string} csvContent - The CSV string content
 * @param {string} filename - The filename for the download
 */
export const downloadCsv = (csvContent, filename = 'expenso-expenses.csv') => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export expenses to CSV and trigger download.
 * @param {Array} expenses - Array of expense objects
 * @param {string} [filename] - Optional custom filename
 */
export const exportExpenses = (expenses, filename) => {
  const csv = expensesToCsv(expenses);
  if (!csv) return;
  const date = new Date().toISOString().slice(0, 10);
  downloadCsv(csv, filename || `expenso-expenses-${date}.csv`);
};

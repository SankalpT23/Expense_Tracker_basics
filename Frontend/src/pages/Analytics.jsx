import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChevronLeft, ChevronRight, DollarSign, TrendingDown } from 'lucide-react';
import { getMonthlySummary, getAllExpenses, getCategoryColor, getCategoryIcon, CATEGORIES } from '../api/expensoApi';
import StatCard from '../components/StatCard';
import './Analytics.css';

const CHART_COLORS = ['#7c5cfc', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#06b6d4', '#ef4444', '#6b7280'];

function Analytics() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [summary, setSummary] = useState(null);
  const [allExpenses, setAllExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [month, year]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [summaryData, expenses] = await Promise.all([
        getMonthlySummary(month, year),
        getAllExpenses(),
      ]);
      setSummary(summaryData);
      setAllExpenses(expenses);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const formatCurrency = (val) => `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  // Pie chart data
  const pieData = summary?.categoryWise
    ? Object.entries(summary.categoryWise).map(([name, value]) => ({
        name,
        value,
        color: getCategoryColor(name),
        icon: getCategoryIcon(name),
      }))
    : [];

  // Bar chart data
  const barData = [...pieData].sort((a, b) => b.value - a.value);

  // Calculate stats
  const totalAmount = summary?.totalAmount || 0;
  const categoryCount = pieData.length;
  const highestCategory = barData.length > 0 ? barData[0] : null;
  const monthExpenses = allExpenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() + 1 === month && d.getFullYear() === year;
  });
  const txnCount = monthExpenses.length;

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{getCategoryIcon(payload[0].name)} {payload[0].name}</p>
          <p className="tooltip-value">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{getCategoryIcon(label)} {label}</p>
          <p className="tooltip-value">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  // Custom pie label
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="12" fontWeight="700">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="analytics-page" id="analytics-page">
      <div className="page-header">
        <h1>Analytics</h1>
        <p>Deep dive into your spending patterns</p>
      </div>

      {/* Month Selector */}
      <motion.div
        className="month-selector glass-card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button className="btn-icon month-nav" onClick={prevMonth} id="prev-month-btn">
          <ChevronLeft size={20} />
        </button>
        <div className="month-display">
          <span className="month-name">{monthNames[month - 1]}</span>
          <span className="month-year">{year}</span>
        </div>
        <button className="btn-icon month-nav" onClick={nextMonth} id="next-month-btn">
          <ChevronRight size={20} />
        </button>
      </motion.div>

      {/* Stats Row */}
      <div className="analytics-stats">
        <StatCard
          icon={DollarSign}
          label="Total Spent"
          value={formatCurrency(totalAmount)}
          subtitle={`${txnCount} transaction${txnCount !== 1 ? 's' : ''}`}
          accentColor="#7c5cfc"
          delay={0.1}
        />
        <StatCard
          icon={TrendingDown}
          label="Highest Category"
          value={highestCategory ? highestCategory.name : '—'}
          subtitle={highestCategory ? formatCurrency(highestCategory.value) : 'No data'}
          accentColor="#ec4899"
          delay={0.2}
        />
      </div>

      {pieData.length > 0 ? (
        <>
          {/* Charts Grid */}
          <div className="charts-grid">
            {/* Pie Chart */}
            <motion.div
              className="chart-card glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3>Category Distribution</h3>
              <div className="chart-container pie-chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={120}
                      dataKey="value"
                      labelLine={false}
                      label={renderCustomLabel}
                      stroke="rgba(0,0,0,0.3)"
                      strokeWidth={2}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center label */}
                <div className="pie-center-label">
                  <span className="pie-center-amount">{formatCurrency(totalAmount)}</span>
                  <span className="pie-center-text">Total</span>
                </div>
              </div>

              {/* Legend */}
              <div className="pie-legend">
                {pieData.map(entry => (
                  <div key={entry.name} className="legend-item">
                    <span className="legend-dot" style={{ background: entry.color }} />
                    <span className="legend-label">{entry.icon} {entry.name}</span>
                    <span className="legend-value">{formatCurrency(entry.value)}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Bar Chart */}
            <motion.div
              className="chart-card glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3>Category Comparison</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={380}>
                  <BarChart data={barData} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                    <XAxis
                      type="number"
                      tick={{ fill: '#6e7681', fontSize: 11 }}
                      axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                      tickLine={false}
                      tickFormatter={(v) => `₹${v}`}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{ fill: '#8b949e', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      width={100}
                    />
                    <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
                      {barData.map((entry, index) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Detailed Breakdown Table */}
          <motion.div
            className="breakdown-card glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3>Detailed Breakdown</h3>
            <table className="data-table breakdown-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Percentage</th>
                  <th>Share</th>
                </tr>
              </thead>
              <tbody>
                {barData.map(entry => {
                  const pct = ((entry.value / parseFloat(totalAmount)) * 100).toFixed(1);
                  return (
                    <tr key={entry.name}>
                      <td>
                        <span className="breakdown-cat">
                          <span className="breakdown-dot" style={{ background: entry.color }} />
                          {entry.icon} {entry.name}
                        </span>
                      </td>
                      <td>
                        <span className="amount">{formatCurrency(entry.value)}</span>
                      </td>
                      <td>{pct}%</td>
                      <td>
                        <div className="breakdown-bar-track">
                          <motion.div
                            className="breakdown-bar-fill"
                            style={{ background: entry.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>
        </>
      ) : (
        <motion.div
          className="glass-card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="empty-state">
            <TrendingDown size={48} />
            <h3>No data for {monthNames[month - 1]} {year}</h3>
            <p>Start adding expenses to see your analytics here</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default Analytics;

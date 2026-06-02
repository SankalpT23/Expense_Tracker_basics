import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Tag, CalendarDays, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getAllExpenses, getMonthlySummary, getCategoryIcon, getCategoryColor } from '../api/expensoApi';
import StatCard from '../components/StatCard';
import './Dashboard.css';

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [expResult, summaryResult] = await Promise.allSettled([
        getAllExpenses(),
        getMonthlySummary(currentMonth, currentYear),
      ]);
      if (expResult.status === 'fulfilled') {
        setExpenses(expResult.value);
      }
      if (summaryResult.status === 'fulfilled') {
        setMonthlySummary(summaryResult.value);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Compute stats
  const totalSpent = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const monthlyTotal = monthlySummary?.totalAmount || 0;
  const uniqueCategories = [...new Set(expenses.map(e => e.category))].length;
  const avgExpense = expenses.length > 0 ? totalSpent / expenses.length : 0;

  // Recent expenses (last 5)
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Build chart data — daily spending for current month
  const buildChartData = () => {
    const thisMonthExpenses = expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear;
    });

    const dailyMap = {};
    thisMonthExpenses.forEach(e => {
      const day = new Date(e.date).getDate();
      dailyMap[day] = (dailyMap[day] || 0) + parseFloat(e.amount || 0);
    });

    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const data = [];
    let cumulative = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const daySpend = dailyMap[d] || 0;
      cumulative += daySpend;
      if (d <= now.getDate()) {
        data.push({ day: `${d}`, spending: daySpend, cumulative: Math.round(cumulative * 100) / 100 });
      }
    }
    return data;
  };

  const chartData = buildChartData();

  const formatCurrency = (val) => `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">Day {label}</p>
          <p className="tooltip-value">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
      </div>
    );
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="dashboard" id="dashboard-page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>{(() => {
          const hour = new Date().getHours();
          if (hour < 12) return '☀️ Good Morning! Here\'s your financial overview.';
          if (hour < 17) return '🌤️ Good Afternoon! Here\'s your spending snapshot.';
          return '🌙 Good Evening! Let\'s review your finances.';
        })()}</p>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <StatCard
          icon={Wallet}
          label="Total Spent"
          value={formatCurrency(totalSpent)}
          subtitle="All time"
          accentColor="#7c5cfc"
          delay={0}
        />
        <StatCard
          icon={TrendingUp}
          label={`${monthNames[currentMonth - 1]} Spending`}
          value={formatCurrency(monthlyTotal)}
          subtitle="This month"
          accentColor="#ec4899"
          delay={0.1}
        />
        <StatCard
          icon={Tag}
          label="Categories"
          value={uniqueCategories}
          subtitle="Active categories"
          accentColor="#10b981"
          delay={0.2}
        />
        <StatCard
          icon={CalendarDays}
          label="Avg. Expense"
          value={formatCurrency(avgExpense)}
          subtitle={`Across ${expenses.length} expenses`}
          accentColor="#f59e0b"
          delay={0.3}
        />
      </div>

      {/* Chart + Recent */}
      <div className="dashboard-grid">
        {/* Spending Chart */}
        <motion.div
          className="chart-card glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="chart-header">
            <div>
              <h3>Spending Trend</h3>
              <p className="text-secondary">{monthNames[currentMonth - 1]} {currentYear} — Cumulative</p>
            </div>
          </div>
          <div className="chart-container">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7c5cfc" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#7c5cfc" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: '#6e7681', fontSize: 11 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fill: '#6e7681', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₹${v}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="cumulative"
                    stroke="#7c5cfc"
                    strokeWidth={2.5}
                    fill="url(#spendingGradient)"
                    dot={false}
                    activeDot={{ r: 5, fill: '#7c5cfc', stroke: '#1c2333', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                <p>No spending data this month</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Expenses */}
        <motion.div
          className="recent-card glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="recent-header">
            <h3>Recent Expenses</h3>
            <Link to="/expenses" className="view-all-link">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="recent-list">
            {recentExpenses.length > 0 ? (
              recentExpenses.map((exp, i) => (
                <motion.div
                  key={exp.id}
                  className="recent-item"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                >
                  <div className="recent-item-icon" style={{ background: `${getCategoryColor(exp.category)}15`, color: getCategoryColor(exp.category) }}>
                    {getCategoryIcon(exp.category)}
                  </div>
                  <div className="recent-item-info">
                    <span className="recent-item-title">{exp.title}</span>
                    <span className="recent-item-meta">{exp.category} · {formatDate(exp.date)}</span>
                  </div>
                  <span className="recent-item-amount">-{formatCurrency(exp.amount)}</span>
                </motion.div>
              ))
            ) : (
              <div className="empty-state" style={{ padding: '32px 16px' }}>
                <p>No expenses yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Category Breakdown quick bar */}
      {monthlySummary?.categoryWise && Object.keys(monthlySummary.categoryWise).length > 0 && (
        <motion.div
          className="category-bar-card glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3>Category Breakdown</h3>
          <div className="category-bars">
            {Object.entries(monthlySummary.categoryWise)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, amount]) => {
                const percentage = (amount / parseFloat(monthlyTotal)) * 100;
                return (
                  <div key={cat} className="cat-bar-item">
                    <div className="cat-bar-header">
                      <span className="cat-bar-name">
                        {getCategoryIcon(cat)} {cat}
                      </span>
                      <span className="cat-bar-value">{formatCurrency(amount)}</span>
                    </div>
                    <div className="cat-bar-track">
                      <motion.div
                        className="cat-bar-fill"
                        style={{ background: getCategoryColor(cat) }}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default Dashboard;

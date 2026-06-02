import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Pencil, Trash2, Receipt, X, Download } from 'lucide-react';
import { getAllExpenses, createExpense, updateExpense, deleteExpense, getExpensesByCategory, CATEGORIES, getCategoryIcon, getCategoryColor } from '../api/expensoApi';
import ExpenseModal from '../components/ExpenseModal';
import toast from 'react-hot-toast';
import { exportExpenses } from '../utils/exportCsv';
import './Expenses.css';

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    filterExpenses();
  }, [expenses, searchQuery, selectedCategory]);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const data = await getAllExpenses();
      setExpenses(data);
    } catch (err) {
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const filterExpenses = () => {
    let result = [...expenses];

    if (searchQuery) {
      result = result.filter(e =>
        e.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.note?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter(e => e.category === selectedCategory);
    }

    result.sort((a, b) => new Date(b.date) - new Date(a.date));
    setFilteredExpenses(result);
  };

  const handleAdd = () => {
    setEditingExpense(null);
    setModalOpen(true);
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setModalOpen(true);
  };

  const handleSubmit = async (data) => {
    try {
      if (editingExpense) {
        await updateExpense(editingExpense.id, data);
        toast.success('Expense updated!');
      } else {
        await createExpense(data);
        toast.success('Expense added!');
      }
      setModalOpen(false);
      setEditingExpense(null);
      await loadExpenses();
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      toast.success('Expense deleted');
      setDeleteConfirm(null);
      await loadExpenses();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const formatCurrency = (val) => `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const totalFiltered = filteredExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="expenses-page" id="expenses-page">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>Expenses</h1>
            <p>Manage and track all your expenses</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn btn-secondary"
              onClick={() => {
                exportExpenses(filteredExpenses);
                toast.success(`Exported ${filteredExpenses.length} expense${filteredExpenses.length !== 1 ? 's' : ''} to CSV`);
              }}
              disabled={filteredExpenses.length === 0}
              id="export-csv-btn"
              title="Export to CSV"
            >
              <Download size={18} />
              Export
            </button>
            <button className="btn btn-primary" onClick={handleAdd} id="add-expense-btn">
              <Plus size={18} />
              Add Expense
            </button>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <motion.div
        className="filters-bar glass-card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="search-expenses"
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery('')}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className="category-filters">
          <Filter size={14} className="filter-icon" />
          <button
            className={`filter-chip ${selectedCategory === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('All')}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              className={`filter-chip ${selectedCategory === cat.value ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.value)}
              style={selectedCategory === cat.value ? { borderColor: cat.color, color: cat.color } : {}}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        <div className="filter-summary">
          <span>{filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''}</span>
          <span className="filter-total">Total: {formatCurrency(totalFiltered)}</span>
        </div>
      </motion.div>

      {/* Expenses List */}
      <div className="expenses-list">
        {filteredExpenses.length > 0 ? (
          <motion.div className="glass-card expense-table-wrapper">
            <table className="data-table" id="expenses-table">
              <thead>
                <tr>
                  <th>Expense</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredExpenses.map((exp, i) => (
                    <motion.tr
                      key={exp.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25, delay: i * 0.02 }}
                    >
                      <td>
                        <div className="expense-info">
                          <div className="expense-icon-cell" style={{ background: `${getCategoryColor(exp.category)}12`, color: getCategoryColor(exp.category) }}>
                            {getCategoryIcon(exp.category)}
                          </div>
                          <div>
                            <span className="expense-title">{exp.title}</span>
                            {exp.note && <span className="expense-note">{exp.note}</span>}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`category-badge ${exp.category?.toLowerCase()}`}>
                          {exp.category}
                        </span>
                      </td>
                      <td>
                        <div className="expense-date-cell">
                          <span>{formatDate(exp.date)}</span>
                          <span className="expense-time">{formatTime(exp.date)}</span>
                        </div>
                      </td>
                      <td>
                        <span className="amount negative">{formatCurrency(exp.amount)}</span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon action-edit"
                            onClick={() => handleEdit(exp)}
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            className="btn-icon action-delete"
                            onClick={() => setDeleteConfirm(exp.id)}
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </motion.div>
        ) : (
          <motion.div
            className="glass-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="empty-state">
              <Receipt size={48} />
              <h3>No expenses found</h3>
              <p>{searchQuery || selectedCategory !== 'All' ? 'Try adjusting your filters' : 'Click "Add Expense" to get started'}</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <ExpenseModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingExpense(null); }}
        onSubmit={handleSubmit}
        expense={editingExpense}
      />

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              className="delete-dialog"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="delete-dialog-icon">
                <Trash2 size={24} />
              </div>
              <h3>Delete Expense?</h3>
              <p>This action cannot be undone.</p>
              <div className="delete-dialog-actions">
                <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)} id="confirm-delete-btn">
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Expenses;

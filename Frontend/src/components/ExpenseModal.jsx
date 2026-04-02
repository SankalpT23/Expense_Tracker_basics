import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { CATEGORIES } from '../api/expensoApi';
import './ExpenseModal.css';

function ExpenseModal({ isOpen, onClose, onSubmit, expense = null }) {
  const isEdit = !!expense;
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    note: '',
    date: new Date().toISOString().slice(0, 16),
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title || '',
        amount: expense.amount?.toString() || '',
        category: expense.category || 'Food',
        note: expense.note || '',
        date: expense.date ? expense.date.slice(0, 16) : new Date().toISOString().slice(0, 16),
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        category: 'Food',
        note: '',
        date: new Date().toISOString().slice(0, 16),
      });
    }
  }, [expense, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      amount: parseFloat(formData.amount),
      category: formData.category,
      note: formData.note,
      date: formData.date + ':00',
    };
    onSubmit(payload);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>{isEdit ? 'Edit Expense' : 'New Expense'}</h2>
              <button className="btn-icon" onClick={onClose} id="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label" htmlFor="expense-title">Title</label>
                  <input
                    className="form-input"
                    id="expense-title"
                    type="text"
                    name="title"
                    placeholder="e.g. Morning coffee"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    autoFocus
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="expense-amount">Amount (₹)</label>
                    <input
                      className="form-input"
                      id="expense-amount"
                      type="number"
                      name="amount"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="expense-category">Category</label>
                    <select
                      className="form-select"
                      id="expense-category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="expense-date">Date & Time</label>
                  <input
                    className="form-input"
                    id="expense-date"
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="expense-note">Note (optional)</label>
                  <input
                    className="form-input"
                    id="expense-note"
                    type="text"
                    name="note"
                    placeholder="Add a note..."
                    value={formData.note}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" id="modal-submit-btn">
                  {isEdit ? 'Save Changes' : 'Add Expense'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ExpenseModal;

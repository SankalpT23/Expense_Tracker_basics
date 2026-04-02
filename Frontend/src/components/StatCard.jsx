import { motion } from 'framer-motion';
import './StatCard.css';

function StatCard({ icon: Icon, label, value, subtitle, accentColor, delay = 0 }) {
  return (
    <motion.div
      className="stat-card glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="stat-card-header">
        <div className="stat-icon" style={{ background: `${accentColor}15`, color: accentColor }}>
          <Icon size={22} />
        </div>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {subtitle && <div className="stat-subtitle">{subtitle}</div>}
      <div className="stat-glow" style={{ background: `radial-gradient(circle at 50% 100%, ${accentColor}10, transparent 70%)` }} />
    </motion.div>
  );
}

export default StatCard;

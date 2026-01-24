import './StatBox.css';

interface StatBoxProps {
  value: string | number;
  label: string;
  large?: boolean;
}

const StatBox = ({ value, label, large = false }: StatBoxProps) => {
  if (large) {
    return (
      <div className="stat-box-large">
        <div className="stat-number-large">{value}</div>
        <div className="stat-text">{label}</div>
      </div>
    );
  }

  return (
    <div className="stat-box">
      <div className="stat-number">{value}</div>
      <div className="stat-text">{label}</div>
    </div>
  );
};

export default StatBox;

import '../../styles/ui/StatusMessage.css';

// Mensaje de carga / error / lista vacía
const StatusMessage = ({ error = false, children }) => (
  <p className={error ? 'status-message error' : 'status-message'}>{children}</p>
);

export default StatusMessage;

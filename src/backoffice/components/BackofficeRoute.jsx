import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function BackofficeRoute({ children }) {
  const { user } = useAuth();
  if (!user || !['MANAGER', 'ADMIN'].includes(user.role)) {
    return <Navigate to="/backoffice/login" replace />;
  }
  return children;
}

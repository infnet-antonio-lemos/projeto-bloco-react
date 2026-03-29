import { useAuth } from '../context/AuthContext';
import './AdminPage.css';

export default function AdminPage() {
  const { user } = useAuth();

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>🔒 Painel Administrativo</h1>
        <p className="admin-welcome">Bem-vindo, <strong>{user?.displayName}</strong></p>
      </div>

      <div className="admin-grid">
        <div className="admin-card">
          <h2>Usuários</h2>
          <p className="admin-card-value">3</p>
          <p className="admin-card-label">contas registradas</p>
        </div>
        <div className="admin-card">
          <h2>Perfis de Acesso</h2>
          <ul className="admin-roles-list">
            <li><span className="role-badge role-admin">admin</span> — acesso total</li>
            <li><span className="role-badge role-user">user</span> — acesso padrão</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-gray-200 transition-colors">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-800">{value}</span>
    </div>
  );
}

export default function AccountPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwMsg, setPwMsg] = useState({ text: '', error: false });
  const [pwLoading, setPwLoading] = useState(false);

  const [emailForm, setEmailForm] = useState({ newEmail: '', password: '' });
  const [emailMsg, setEmailMsg] = useState({ text: '', error: false });
  const [emailLoading, setEmailLoading] = useState(false);

  const [deletePassword, setDeletePassword] = useState('');
  const [deleteStep, setDeleteStep] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    api.get('/account')
      .then(({ data }) => setAccount(data))
      .finally(() => setLoading(false));
  }, []);

  const flash = (setter, text, error = false) => {
    setter({ text, error });
    setTimeout(() => setter({ text: '', error: false }), 5000);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) {
      return flash(setPwMsg, 'Les mots de passe ne correspondent pas.', true);
    }
    setPwLoading(true);
    try {
      const { data } = await api.put('/account/password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
      flash(setPwMsg, data.message);
    } catch (err) {
      flash(setPwMsg, err.response?.data?.error || 'Erreur.', true);
    } finally {
      setPwLoading(false);
    }
  };

  const handleChangeEmail = async (e) => {
    e.preventDefault();
    setEmailLoading(true);
    try {
      const { data } = await api.put('/account/email', emailForm);
      setEmailForm({ newEmail: '', password: '' });
      flash(setEmailMsg, data.message);
      // L'email a changé : on déconnecte après 3s
      setTimeout(() => { logout(); navigate('/login'); }, 3000);
    } catch (err) {
      flash(setEmailMsg, err.response?.data?.error || 'Erreur.', true);
    } finally {
      setEmailLoading(false);
    }
  };

  const handleExport = () => {
    window.location.href = `${api.defaults.baseURL}/account/export`;
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setDeleteLoading(true);
    try {
      await api.delete('/account', { data: { password: deletePassword } });
      logout();
      navigate('/');
    } catch (err) {
      setDeleteMsg(err.response?.data?.error || 'Erreur.');
      setDeleteLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-gray-400">
      <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm">Chargement…</p>
    </div>
  );
  if (!account) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-5">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mon compte</h1>
        <p className="text-gray-500 text-sm mt-1">Gérez vos informations personnelles</p>
      </div>

      {/* Données personnelles */}
      <Section title="Mes informations personnelles">
        <Field label="Adresse email" value={account.email} />
        <Field label="Rôle" value={account.role} />
        <Field
          label="Email vérifié"
          value={account.isEmailVerified ? 'Oui' : 'Non'}
        />
        <Field
          label="Membre depuis"
          value={new Date(account.createdAt).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric',
          })}
        />
        <Field label="Nombre de commandes" value={account.orders.length} />
        <p className="text-xs text-gray-400 mt-4">
          Conformément au RGPD (art. 15), vous avez le droit d'accéder à l'ensemble de vos données personnelles.
          Utilisez le bouton "Exporter mes données" ci-dessous pour les télécharger.
        </p>
      </Section>

      {/* Changer le mot de passe */}
      <Section title="Changer le mot de passe">
        <form onSubmit={handleChangePassword} className="flex flex-col gap-3">
          <input
            type="password"
            placeholder="Mot de passe actuel"
            value={pwForm.currentPassword}
            onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
            required
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 focus:bg-white transition-shadow"
          />
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={pwForm.newPassword}
            onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
            required
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 focus:bg-white transition-shadow"
          />
          <input
            type="password"
            placeholder="Confirmer le nouveau mot de passe"
            value={pwForm.confirm}
            onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
            required
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 focus:bg-white transition-shadow"
          />
          {pwMsg.text && (
            <p className={`text-sm ${pwMsg.error ? 'text-red-500' : 'text-green-600'}`}>{pwMsg.text}</p>
          )}
          <button
            type="submit"
            disabled={pwLoading}
            className="bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {pwLoading ? 'Enregistrement...' : 'Modifier le mot de passe'}
          </button>
        </form>
      </Section>

      {/* Changer l'email */}
      <Section title="Changer l'adresse email">
        <p className="text-xs text-gray-400 mb-3">
          Un email de vérification sera envoyé à la nouvelle adresse. Vous serez déconnecté automatiquement.
        </p>
        <form onSubmit={handleChangeEmail} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Nouvelle adresse email"
            value={emailForm.newEmail}
            onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
            required
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 focus:bg-white transition-shadow"
          />
          <input
            type="password"
            placeholder="Confirmer avec votre mot de passe"
            value={emailForm.password}
            onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
            required
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 focus:bg-white transition-shadow"
          />
          {emailMsg.text && (
            <p className={`text-sm ${emailMsg.error ? 'text-red-500' : 'text-green-600'}`}>{emailMsg.text}</p>
          )}
          <button
            type="submit"
            disabled={emailLoading}
            className="bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {emailLoading ? 'Enregistrement...' : "Modifier l'adresse email"}
          </button>
        </form>
      </Section>

      {/* Portabilité & suppression */}
      <Section title="Mes données (RGPD)">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Droit à la portabilité (art. 20)</strong> — Téléchargez l'intégralité de vos données personnelles et commandes au format JSON.
            </p>
            <button
              onClick={handleExport}
              className="border border-green-200 text-green-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-50 transition-colors"
            >
              Exporter mes données
            </button>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Droit à l'effacement (art. 17)</strong> — La suppression de votre compte est définitive et irréversible. Toutes vos données (profil, commandes) seront effacées.
            </p>
            {!deleteStep ? (
              <button
                onClick={() => setDeleteStep(true)}
                className="text-red-500 hover:text-red-700 text-sm font-semibold border border-red-200 px-4 py-2.5 rounded-xl hover:bg-red-50 transition-colors"
              >
                Supprimer mon compte
              </button>
            ) : (
              <form onSubmit={handleDelete} className="flex flex-col gap-2">
                <p className="text-sm font-medium text-red-600">
                  Confirmez en saisissant votre mot de passe. Cette action est irréversible.
                </p>
                <input
                  type="password"
                  placeholder="Votre mot de passe"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  required
                  className="border border-red-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-red-50 focus:bg-white transition-shadow"
                />
                {deleteMsg && <p className="text-sm text-red-500">{deleteMsg}</p>}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={deleteLoading}
                    className="bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    {deleteLoading ? 'Suppression...' : 'Confirmer la suppression'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setDeleteStep(false); setDeletePassword(''); setDeleteMsg(''); }}
                    className="border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
}

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-green-700 mb-8">Politique de confidentialité</h1>
      <p className="text-sm text-gray-500 mb-8">
        Conformément au Règlement Général sur la Protection des Données (RGPD — UE 2016/679) et à la loi
        Informatique et Libertés.
      </p>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">1. Responsable du traitement</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          <strong>[Nom de la société]</strong> — [Adresse] — contact@click-collect.fr
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">2. Données collectées</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 text-gray-700 font-medium">Donnée</th>
                <th className="text-left px-4 py-2 text-gray-700 font-medium">Finalité</th>
                <th className="text-left px-4 py-2 text-gray-700 font-medium">Base légale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="px-4 py-2 text-gray-600">Adresse email</td>
                <td className="px-4 py-2 text-gray-600">Création de compte, connexion, notifications commandes</td>
                <td className="px-4 py-2 text-gray-600">Exécution du contrat</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-gray-600">Mot de passe (haché)</td>
                <td className="px-4 py-2 text-gray-600">Authentification sécurisée</td>
                <td className="px-4 py-2 text-gray-600">Exécution du contrat</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-gray-600">Historique de commandes</td>
                <td className="px-4 py-2 text-gray-600">Gestion des commandes click & collect</td>
                <td className="px-4 py-2 text-gray-600">Exécution du contrat</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-gray-600">Date d'inscription</td>
                <td className="px-4 py-2 text-gray-600">Gestion du compte</td>
                <td className="px-4 py-2 text-gray-600">Intérêt légitime</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">3. Durée de conservation</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Vos données sont conservées pendant toute la durée de votre relation contractuelle avec nous,
          puis archivées pendant 3 ans après la dernière activité, conformément aux obligations légales
          (art. L. 110-4 du Code de commerce). Les données sont supprimées dès la fermeture du compte
          ou sur demande.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">4. Destinataires des données</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Vos données ne sont pas vendues ni cédées à des tiers. Elles peuvent être transmises à :
        </p>
        <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
          <li>Notre prestataire d'hébergement ([Nom]) pour l'exploitation technique du service</li>
          <li>Notre prestataire d'envoi d'emails ([Mailtrap/autre]) pour les notifications transactionnelles</li>
        </ul>
        <p className="text-sm text-gray-600 mt-2">
          Ces prestataires agissent en qualité de sous-traitants et sont soumis aux mêmes obligations RGPD.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">5. Vos droits</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          Conformément aux articles 15 à 22 du RGPD, vous disposez des droits suivants, tous accessibles
          depuis votre espace{' '}
          <a href="/account" className="text-green-600 hover:underline">Mon compte</a> :
        </p>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li><strong>Droit d'accès (art. 15)</strong> — consulter toutes vos données personnelles</li>
          <li><strong>Droit de rectification (art. 16)</strong> — corriger vos informations</li>
          <li><strong>Droit à l'effacement (art. 17)</strong> — supprimer votre compte et toutes vos données</li>
          <li><strong>Droit à la portabilité (art. 20)</strong> — exporter vos données au format JSON</li>
          <li><strong>Droit d'opposition (art. 21)</strong> — vous opposer à certains traitements</li>
        </ul>
        <p className="text-sm text-gray-600 mt-3">
          Vous pouvez également introduire une réclamation auprès de la{' '}
          <strong>CNIL</strong> (Commission Nationale de l'Informatique et des Libertés) :{' '}
          <span className="text-green-600">www.cnil.fr</span>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">6. Sécurité</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Nous mettons en œuvre des mesures techniques et organisationnelles appropriées : chiffrement des
          mots de passe (bcrypt), communications sécurisées (HTTPS), authentification par token JWT,
          accès aux données limité selon les rôles (client, manager, admin).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">7. Contact DPO</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Pour toute question relative à vos données personnelles : <strong>privacy@click-collect.fr</strong>
        </p>
      </section>

      <p className="text-xs text-gray-400 mt-8">Dernière mise à jour : juin 2026</p>
    </div>
  );
}

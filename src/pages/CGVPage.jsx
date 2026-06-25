export default function CGVPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-green-700 mb-8">Conditions Générales de Vente</h1>
      <p className="text-sm text-gray-500 mb-8">
        En passant une commande sur FruityCollect, vous acceptez les présentes CGV.
      </p>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">1. Objet</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Les présentes Conditions Générales de Vente régissent les relations contractuelles entre
          <strong> [Nom de la société]</strong> (ci-après « FruityCollect ») et tout client
          (ci-après « le Client ») passant commande via le service de click & collect en ligne.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">2. Produits et disponibilité</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Les produits proposés sont des fruits découpés et smoothies préparés par nos magasins partenaires.
          Ils sont disponibles dans la limite des stocks. En cas d'indisponibilité après commande,
          le Client sera informé et la commande annulée sans frais.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">3. Prix</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Les prix sont indiqués en euros toutes taxes comprises (TTC). FruityCollect se réserve le droit
          de modifier ses prix à tout moment. Le prix applicable est celui affiché au moment de la validation
          de la commande.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">4. Commande et confirmation</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          La commande est validée après :
        </p>
        <ol className="list-decimal list-inside text-sm text-gray-600 mt-2 space-y-1">
          <li>Sélection des produits et du créneau de retrait</li>
          <li>Validation du panier par le Client</li>
          <li>Confirmation de la commande (statut : EN ATTENTE)</li>
        </ol>
        <p className="text-sm text-gray-600 mt-3">
          La commande devient ferme lors de son acceptation par le magasin (statut : ACCEPTÉE).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">5. Retrait (Click & Collect)</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Le Client s'engage à récupérer sa commande au magasin sélectionné à la date et à l'heure choisies.
          Passé ce délai, le magasin se réserve le droit de ne plus conserver la commande. Aucun remboursement
          ne pourra être exigé en cas de non-présentation dans le délai imparti.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">6. Annulation</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Le Client peut annuler sa commande tant que son statut est « EN ATTENTE », depuis son espace
          « Mes commandes ». Toute commande dont le statut est « ACCEPTÉE » ou « PRÊTE » ne peut plus
          être annulée. En raison de la nature périssable des produits, le droit de rétractation de
          14 jours prévu par le Code de la consommation ne s'applique pas (art. L. 221-28 al. 3°).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">7. Responsabilité</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          FruityCollect ne saurait être tenu responsable des dommages résultant d'une mauvaise utilisation
          du service, d'une indisponibilité technique ou d'une erreur du Client lors de la passation de commande.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">8. Données personnelles</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Le traitement des données liées à la commande est détaillé dans notre{' '}
          <a href="/politique-confidentialite" className="text-green-600 hover:underline">
            Politique de confidentialité
          </a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">9. Litiges et droit applicable</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable sera
          recherchée en priorité. À défaut, les tribunaux compétents du ressort de [Ville] seront saisis.<br /><br />
          Le Client peut également recourir à la médiation de la consommation via la plateforme européenne
          de règlement en ligne des litiges : <span className="text-green-600">ec.europa.eu/consumers/odr</span>
        </p>
      </section>

      <p className="text-xs text-gray-400 mt-8">Dernière mise à jour : juin 2026</p>
    </div>
  );
}

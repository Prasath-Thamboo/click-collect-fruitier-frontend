// Mode démonstration : le projet n'est pas encore exploité commercialement.
// - les paiements (commandes et abonnements) sont désactivés côté interface ;
// - les emails partent dans une boîte de test (Mailtrap) et n'arrivent pas chez les clients.
// Passer à false le jour où Stripe (clés live) et un vrai SMTP (Brevo…) sont configurés.
export const DEMO_MODE = true;

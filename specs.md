# Résumé des Spécifications : Interface de Gestion des Déplacements et e-Logbook

Ce système vise à créer une plateforme web sécurisée pour la gestion optimisée des mouvements de véhicules et d'équipes, complétée par l'application mobile pour les chauffeurs.

## 1. Interface de Gestion des Déplacements (Plateforme Web Principale)

**Objectif Principal :** Planifier, consolider, valider et suivre les déplacements des véhicules et équipes pour les projets. L'objectif est d'optimiser les ressources logistiques, assurer une coordination efficace et, à terme (V2), permettre la mutualisation des mouvements inter-ONG via un accès invité.

**Fonctionnalités Clés :**

*   **Gestion des Mouvements :**
    *   Configuration des accès utilisateurs avec divers profils (Admin, Superviseur Log, Technicien/Demandeur, Guest).
    *   Base de données préremplie (chauffeurs, véhicules, lieux).
    *   Saisie des demandes de mouvement par les demandeurs.
    *   Consolidation et affectation des véhicules/chauffeurs par les logisticiens.
    *   Processus de validation multi-niveaux (sécurité, logistique, chef chauffeur).
    *   Notifications automatiques aux demandeurs et chauffeurs.
    *   **Synchronisation avec le e-logbook.**
*   **Suivi et Reporting :**
    *   Tableau de bord synthétique des mouvements.
    *   Rapports hebdomadaires automatisés pour chauffeurs et chefs chauffeurs.
    *   Calcul des distances théoriques et comparaison avec les logbooks.
*   **Module de Mutualisation :**
    *   Intégration des demandes d'organisations externes (via un jeton sécurisé).
    *   Processus de validation similaire aux demandes internes.
    *   Calcul des kilomètres théoriques pour les tiers.
*   **Gestion des Données :**
    *   Base de données préremplie avec coordonnées GPS, véhicules, chauffeurs.
    *   Gestion des utilisateurs avec droits adaptés.
    *   Historique des mouvements pour audits et analyse.

**Contraintes :**
*   Doit gérer une connexion internet intermittente (solution hors ligne à prévoir).
*   Assurer une sécurité des données rigoureuse (cryptage, authentification 2FA, hébergement sécurisé).

## 2. e-Logbook (incluant le Trip-logbook pour Chauffeurs)

**Objectif :** Une application mobile dédiée aux chauffeurs pour enregistrer leurs déplacements.

**Fonctionnalités Clés :**
*   Application mobile simple pour l'enregistrement des déplacements en temps réel.
*   **Synchronisation automatique avec l'interface principale (web).**
*   Saisie des données au départ et à l'arrivée du trajet.
*   Option de suivi GPS.
*   Mode hors ligne pour les zones à connectivité limitée.

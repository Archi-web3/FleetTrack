# Stratégie de Déploiement Multi-Pays et Multi-Bases

Pour répondre à votre besoin de gérer plusieurs pays (missions) et, au sein de chaque pays, plusieurs bases (Capitales + Terrains), voici l'architecture recommandée. Elle permet d'utiliser **une seule instance logicielle** (facile à maintenir) tout en garantissant que chaque pays/base ne voit que ses propres données.

## 1. Concept : Multi-Tenancy Logique (Séparation Logique)

Plutôt que d'installer un serveur par base (lourd à maintenir), nous allons modifier la structure de la base de données pour inclure la notion de **Hiérarchie Organisationnelle**.

### Hiérarchie proposée
1.  **Organisation Global** (ACF Monde)
2.  **Mission / Pays** (ex: ACF RDC, ACF Mali)
3.  **Base** (ex: Kinshasa, Goma, Bamako)

## 2. Modifications des Données (Modèles)

Il faut créer deux nouvelles "tables" (Collections) et mettre à jour les existantes.

### Nouveaux Modèles
*   **Pays (Mission)**
    *   `nom` (ex: "République Démocratique du Congo")
    *   `code` (ex: "RDC")
    *   `devise` (ex: "USD")
    *   `administrateurs` (Liste d'utilisateurs admins du pays)
*   **Base**
    *   `nom` (ex: "Base de Goma")
    *   `pays` (Lien vers le Pays parent)
    *   `chef_de_base` (Lien vers l'utilisateur responsable)

### Mise à jour des Modèles existants
Chaque donnée doit savoir à qui elle appartient.

*   **Utilisateur** : Ajout des champs `pays_id` et `base_id`.
    *   *Un chauffeur à Goma ne verra que les véhicules de Goma.*
    *   *Un coordinateur à Kinshasa pourra voir tout le pays.*
*   **Véhicule** : Ajout du champ `base_id`.
*   **Lieu** : Ajout du champ `base_id` (ou `pays_id` pour les lieux communs).
*   **Mouvement** : Ajout du champ `base_id` (déduit du véhicule ou du demandeur).

## 3. Comment faire le Paramétrage ? (L'Interface Admin)

Nous allons créer un nouveau module **"Administration Système"** dans l'application Web, accessible uniquement aux "Super Admin".

### Étape A : Installation Initiale (Global)
1.  Créer le premier Pays (ex: RDC).
2.  Créer les Bases de ce pays (Kinshasa, Goma, Bunia...).

### Étape B : Paramétrage Quotidien
Lorsqu'on crée un utilisateur (Chauffeur, Logisticien), on lui assigne :
*   Son **Rôle** (Admin, Tech, Chauffeur...)
*   Sa **Base d'affectation** (ex: Goma)

### Conséquence Automatique
Le système filtrera tout automatiquement :
*   Quand le Logisticien de Goma se connecte, le système fait : `Select * from Vehicules WHERE base = 'Goma'`.
*   Il ne voit pas les véhicules de Kinshasa.

## 4. Gestion de la Synchronisation (e-Logbook)

C'est là que l'architecture devient puissante pour le mobile.
*   L'application mobile e-Logbook télécharge les données lors de la connexion.
*   Le serveur regarde le profil du chauffeur : "Ah, tu es de Goma".
*   Le serveur n'envoie **QUE** les données de Goma au téléphone.
*   Cela rend l'application légère et rapide, même avec des milliers de véhicules dans le monde.

## 5. Résumé du Plan d'Action

1.  **Créer les modèles** `Pays` et `Base` dans le backend.
2.  **Mettre à jour** `Utilisateur` et `Vehicule` pour les lier à une Base.
3.  **Créer une page "Configuration"** dans l'app Web pour gérer ces bases.
4.  **Mettre à jour le Middleware** (le gardien du serveur) pour filtrer les données selon la base de l'utilisateur connecté.

Voulez-vous que je commence par créer les modèles `Pays` et `Base` ?

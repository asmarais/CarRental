Voici la version mise à jour du fichier README, incluant la section des API :

---

# 🚗 CarRental

**CarRental** est une application web conçue pour gérer efficacement les services de location de voitures. Ce projet permet aux utilisateurs de rechercher, réserver et gérer leurs locations, tandis que les administrateurs peuvent superviser la flotte et les détails des réservations.

---

## 📋 Fonctionnalités

- Inscription et connexion des utilisateurs.
- Recherche de voitures disponibles par date et localisation.
- Système de réservation avec intégration des paiements.
- Tableau de bord administrateur pour gérer les voitures, réservations et utilisateurs.
- Design responsive adapté aux ordinateurs et mobiles.

---

## 🛠️ Technologies Utilisées

- **Frontend :** Angular.
- **Backend :** Node.js / Express.
- **Base de données :** MongoDB.
- **Conteneurisation :** Docker.

---

## 🚀 Démarrage
Afin de démarrer notre application facilement, nous avons créé un fichier Docker Compose pour garantir que tout fonctionne sans erreurs de compatibilité de versions. Voici l'exécution de ce projet avec les 2 méthodes.

Utilisez la méthode qui vous convient le mieux en fonction de votre environnement et des outils que vous préférez.

### **Méthode 1 : Démarrage avec Docker**

1. **Prérequis :**
   - Installer [Docker](https://www.docker.com/products/docker-desktop).

2. **Cloner le dépôt :**
   ```bash
   git clone https://github.com/votre-utilisateur/carrental.git
   cd carrental
   ```

3. **Démarrer l'application avec Docker :**
   - Exécutez la commande suivante pour démarrer tous les services (frontend, backend et MongoDB) dans des conteneurs Docker :
     ```bash
     docker-compose up --build
     ```

4. **Accéder à l'application :**
   - Le frontend sera accessible à `http://localhost:4200` et le backend à `http://localhost:5000`.

---

### **Méthode 2 : Démarrage classique (installation des prérequis)**

1. **Cloner le dépôt :**
   ```bash
   git clone https://github.com/votre-utilisateur/carrental.git
   cd carrental
   ```

2. **Installer les dépendances pour le frontend :**
   - Assurez-vous d'avoir [Node.js](https://nodejs.org/) et [npm](https://www.npmjs.com/) installés.
   - Allez dans le dossier `Frontend` et exécutez :
     ```bash
     cd Frontend
     npm install
     ```

3. **Installer les dépendances pour le backend :**
   - Allez dans le dossier `Backend` et exécutez :
     ```bash
     cd Backend
     npm install
     ```

4. **Configurer votre base de données :**
   - Assurez-vous d'avoir [MongoDB](https://www.mongodb.com/try/download/community) installé.

5. **Lancer l'application :**
   - Pour le frontend :
     ```bash
     cd Frontend
     npm start
     ```
   - Pour le backend :
     ```bash
     cd Backend
     npm start
     ```

Votre application sera accessible à `http://localhost:4200` pour le frontend et `http://localhost:5000` pour le backend.

---

## LES API

### **Endpoints Backend**

#### **1. Authentification**
- **POST /api/auth/signup**  
  Permet aux utilisateurs de s'inscrire avec un email et un mot de passe.
  - Corps de la requête :
    ```json
    {
      "nom": "John",
      "prenom": "Doe",
      "email": "exemple@gmail.com",
      "mot_de_passe": "motdepasse",
      "numero_de_telephone": "1234567890",
      "adresse": "123 Main St",
      "cin": "14424412",
    }
    ```

- **POST /api/auth/login**  
  Permet aux utilisateurs de se connecter et de récupérer un token JWT.
  - Corps de la requête :
    ```json
    {
      "email": "exemple@gamil.com",
      "password": "motdepasse"
    }
    ```

#### **2. Voitures**
- **GET /api/voitures**  
  Récupère toutes les voitures disponibles.
  
- **POST /api/voitures**  
  Permet aux administrateurs d'ajouter une nouvelle voiture à la flotte.
  - Corps de la requête :
    ```json
    {
        "marque": "4454",
        "annee": 2023,
        "modele": "ffef",
        "type": "ccsc",
        "immatriculation": "43545",
        "prix_par_jour": 535435,
        "prix_par_mois": 5454,
        "statut": true,
        "pik_up_position": "Downtown",
        "pik_off_position": "Airport",
        "image": "url"
    }
    ```

- **PUT /api/voitures/{id}**  
  Permet aux administrateurs de mettre à jour les détails d'une voiture.
  - Corps de la requête :
    ```json
    {
      "prix_par_jour": 60,
      "disponibilite": false
    }
    ```

- **DELETE /api/voitures/{id}**  
  Supprime une voiture de la flotte.

#### **3. Réservations**

#### **4. Gestion des paiements**

**Note :** Pour accéder aux API protégées, n'oubliez pas de passer le token JWT dans l'en-tête `Authorization` sous la forme `Bearer <votre_token>`.

---

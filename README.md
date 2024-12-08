Voici le fichier README corrigé et mis à jour :

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
   cd carrental
   ```

2. **Installer les dépendances pour le frontend :**
   - Assurez-vous d'avoir [Node.js](https://nodejs.org/) et [npm](https://www.npmjs.com/) installés.
   - Allez dans le dossier `Frontend` et exécutez :
     ```bash
     cd Frontend
     npm install --legacy-peer-deps
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

## Test de projet

### Tester la partie admin
Accédez au lien : [http://localhost:4200/loRe](http://localhost:4200/loRe)
- **Email :** admin@gmail.com
- **Mot de passe :** admin123

### Tester la partie utilisateur
1. Créez un compte utilisateur.
2. Accédez au lien de réservation pour réserver une voiture, puis vous serez redirigé vers une interface de paiement.
3. Pour effectuer des tests de paiements par portefeuille, utilisez le code `111111` pour simuler une transaction réussie et `000000` pour générer une erreur.
4. Pour tester les paiements par carte bancaire ou postale, saisissez le numéro `4242 4242 4242 4242` pour une transaction réussie, ou toute autre combinaison de 16 chiffres pour simuler une erreur.

---


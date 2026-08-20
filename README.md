# Casier Postal Intelligent

### Auteurs
 - Auteur : Plamedi Ilunga
 - Mis-à-jour :
 - Date : 26/11/2024
 - Objet : Mise à jour de la documentation en fonction des modifications effectuées dans l'API

Ce projet est une API construite avec Node.js.Elle a été construite par PLAMEDI ILUNGA

Pour l'utiliser, veuillez suivre les instructions ci-dessous .

## Prérequis

- Visual Studio Code (avec REST client)
- Git
- Node.js (avec npm et chocolatery)
- SQL (avec MSSQL) et ajouter le répertoire bin dans le PATH
- Postman (et créer un compte)

## Installation sql

- installer mssql

```bash
  npm install mssql
```

## Installation

1. Clonez ce dépôt sur votre machine locale.

2. Importer les données : Les données seront fournis dans les prochaines mis-à jour du ReadMe

3. Naviguez jusqu'au répertoire du projet dans votre terminal.

4. Installez les dépendances du projet en exécutant la commande suivante :

```bash
npm i
```
ou
```bash
npm install
```

## Configuration

 Vous devez créer un fichier .env à la racine du projet et y définir les variables d'environnement suivantes :

```bash
  user: l'utilisateur de la base de donnée 
  password: le mot de passe de l'utilisateur
  server: l'adresse du server ou localhost en local
  database: le nom de la base de donnée
  port: 3001 
```

 Remplacez les valeurs par ceux qui correspondent à votre réalité

## Lancer le service

```bash
  node app.js ou npm start
```
## Utilisation

 Une fois l'API démarrée, vous pouvez envoyer des requêtes HTTP à http://localhost:3000

## Documentation de l'API

 Une fois l'API démarrée, sa documentation est disponible à l'adresse suivante :

```http://localhost:3000/myApiDocs```

## Collaboration

n'hésitez pas à faire un issue ou une pull request de vos modification !

## Commits

 Voici la liste de mes commits :




# Jirafy

## Présentation

Jirafy est une application de gestion de projets inspirée de Jira, intégrant des fonctionnalités de suivi de temps similaires à Clockify. Cette solution tout-en-un permet aux équipes de suivre leurs projets, tâches et temps de travail dans une interface unifiée.

## Architecture

Le projet est divisé en deux parties principales :

- **API Backend** : Développée avec Laravel (PHP)
- **Interface Frontend** : Construite avec React.js

## Fonctionnalités principales

### Gestion de projet (inspiré de Jira)

- Création et gestion de projets
- Tableaux Kanban et Scrum
- Suivi des tickets et des problèmes
- Gestion des sprints
- Rapports et analyses

### Suivi du temps (inspiré de Clockify)

- Chronométrage des tâches en temps réel
- Saisie manuelle du temps
- Rapports de temps par projet, utilisateur et période
- Exportation des données de temps

## Installation

### Prérequis

- PHP 8.1 ou supérieur
- Composer
- Node.js et npm
- MySQL ou PostgreSQL
- Serveur web (Apache, Nginx)

### Installation de l'API (Laravel)

```bash
cd api
composer install
cp .env.example .env
# Configurez votre base de données dans le fichier .env
php artisan key:generate
php artisan migrate
php artisan serve

```

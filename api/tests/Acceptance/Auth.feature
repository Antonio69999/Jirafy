Feature: Authentification utilisateur

  Scenario: Un utilisateur s'inscrit avec un email et un mot de passe valides
    Given je suis sur "/register"
    When je remplis "email" avec "test@example.com"
    And je remplis "password" avec "password123"
    And je remplis "password_confirmation" avec "password123"
    And je clique sur "Register"
    Then je vois "Bienvenue"

  Scenario: Un utilisateur ne peut pas s'inscrire avec un email invalide
    Given je suis sur "/register"
    When je remplis "email" avec "email-invalide"
    And je remplis "password" avec "password123"
    And je remplis "password_confirmation" avec "password123"
    And je clique sur "Register"
    Then je vois le message d'erreur "L'email doit être valide"

  Scenario: Un utilisateur ne peut pas s'inscrire si les mots de passe ne correspondent pas
    Given je suis sur "/register"
    When je remplis "email" avec "test@example.com"
    And je remplis "password" avec "password123"
    And je remplis "password_confirmation" avec "differentpassword"
    And je clique sur "Register"
    Then je vois le message d'erreur "Les mots de passe ne correspondent pas"

  Scenario: Un utilisateur se connecte avec des identifiants valides
    Given je suis sur "/login"
    When je remplis "email" avec "user@example.com"
    And je remplis "password" avec "password123"
    And je clique sur "Login"
    Then je vois "Tableau de bord"

  Scenario: Un utilisateur ne peut pas se connecter avec des identifiants invalides
    Given je suis sur "/login"
    When je remplis "email" avec "wrong@example.com"
    And je remplis "password" avec "wrongpassword"
    And je clique sur "Login"
    Then je vois le message d'erreur "Identifiants incorrects"

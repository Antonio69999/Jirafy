<?php

namespace Tests\Support;

class AcceptanceContext
{
    private $I;

    public function __construct(AcceptanceTester $I)
    {
        $this->I = $I;
    }

    /**
     * @Given je suis sur :arg1
     */
    public function jeSuisSur($arg1)
    {
        $this->I->amOnPage($arg1);
    }

    /**
     * @When je remplis :arg1 avec :arg2
     */
    public function jeRemplisAvec($arg1, $arg2)
    {
        $this->I->fillField($arg1, $arg2);
    }

    /**
     * @When je clique sur :arg1
     */
    public function jeCliqueSur($arg1)
    {
        $this->I->click($arg1);
    }

    /**
     * @Then je vois :arg1
     */
    public function jeVois($arg1)
    {
        $this->I->see($arg1);
    }

    /**
     * @Then je vois le message d'erreur :arg1
     */
    public function jeVoisLeMessageDerreur($arg1)
    {
        $this->I->see($arg1);
        $this->I->seeElement('.error-message'); // Plus spécifique
    }

    /**
     * @Then je suis redirigé vers :arg1
     */
    public function jeSuisRedirigeVers($arg1)
    {
        $this->I->seeCurrentUrlEquals($arg1);
    }

    /**
     * @Given un utilisateur existe avec l'email :arg1
     */
    public function unUtilisateurExisteAvecLemail($email)
    {
        $this->I->haveRecord('users', [
            'email' => $email,
            'password' => bcrypt('password123')
        ]);
    }
}

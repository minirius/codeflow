<!DOCTYPE html> <html lang="fr">
    <head>
	    <title>Se connecter</title>
	    <meta charset="UTF-8">
        <!--<link rel="stylesheet" type="text/css" href="main.css">-->
        <?php
            require("./main.php");
        ?>
    </head>
    <body>
        <div class="login_form">
            <form method="post" action="account.php">
                Nom d'utilisateur : <input name="username" value=""><br>
                Mot de passe : <input name="login" value=""><br>
                <input type="submit" value="Connexion">
            </form>
        </div>
        <div class="create_form">
            <form method="post" action="account.php">
                Nom d'utilisateur : <input name="usernamen" value=""><br>
                Mot de passe : <input name="loginn" value=""><br>
                <input type="submit" value="Connexion">
            </form>
        </div>
    </body>
</html>
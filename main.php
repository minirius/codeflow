<?php
    $loginlist = fopen("logins.txt","a+");
    $unlist = fopen("uns.txt","a+");
    if(isset($_POST['username']) && isset($_POST["login"])) { 
        $username = $_POST["username"];
        $password = $_POST["login"];
        $loginhash = hash("sha256",$password);
        while(!feof($loginlist) and !feof($unlist)) {
            if (fgets($loginlist).":".fgets($unlist) == $loginhash.":".$username) {
                echo"Login!";
            } else {
                echo "Wrong login or password !";
            };
        }
            fclose($loginlist);
            fclose($unlist);
    } else if(isset($_POST['usernamen']) && isset($_POST["loginn"])) { 
        $username = $_POST["usernamen"];
        $password = $_POST["loginn"];
        $loginhash = hash("sha256",$password);
        while(!feof($unlist)) {
            if (fgets($unlist) == $username) {
                echo"Username is already taken !";
            } else {
                echo "Okay let's go";
                fwrite($unlist,$username);
                fwrite($loginlist,$loginhash);
            };
        }
        fclose($loginlist);
        fclose($unlist);
    }
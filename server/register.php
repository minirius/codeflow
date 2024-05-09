<?php
    // Allow from any origin
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
        // you want to allow, and if so:
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
    }
    
    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            // may also be using PUT, PATCH, HEAD etc
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    
        exit(0);
    }
$pdo = new PDO("mysql:host=localhost;dbname=codeflow;charset=utf8;", 'marius', 'codeflow1234');

function secured($value) {
    $value = htmlentities($value);

    return $value;
}

if(isset($_GET["name"]) && isset($_GET["pass"]) && isset($_GET["description"])) {
    $name = secured($_GET["name"]);
    $pass = secured($_GET["pass"]);
    $desc = secured($_GET["description"]);
    $statement = $pdo->prepare("INSERT INTO users (id, avatar, name, description, password) VALUES (0, :avatar, :name, :description, :password)");
    $statement->execute(array(
        ":avatar"=>"https://api.dicebear.com/8.x/thumbs/png?seed=$name",
        ":name" => $name,
        ":password" => $pass,
        ":description" => $desc,
    ));
    echo "OK";
} 

?>
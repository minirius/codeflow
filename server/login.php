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

if(isset($_GET["name"]) && isset($_GET["pass"])) {
    $name = secured($_GET["name"]);
    $pass = secured($_GET["pass"]);
    $statement = $pdo->prepare("SELECT * FROM users WHERE name=:name AND password=:password LIMIT 1");
    $statement->execute(array(
        ":name" => $name,
        ":password" => $pass,
    ));
    $rows = $statement->fetchAll(PDO::FETCH_ASSOC);

    if(count($rows) == 1) {
        echo json_encode($rows[0]);
    } else {
        echo "error";
    }
} 

?>
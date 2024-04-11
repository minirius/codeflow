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

if(isset($_GET["id"])) {
    $id = $_GET["id"];
    $statement = $pdo->prepare("SELECT * FROM users WHERE id=:id LIMIT 1");
    $statement->execute(array(
        ":id" => $id
    ));
    $rows = $statement->fetchAll(PDO::FETCH_ASSOC);
} 
if(isset($_GET["name"])) {
    $name = $_GET["name"];
    $statement = $pdo->prepare("SELECT * FROM users WHERE name=:name LIMIT 1");
    $statement->execute(array(
        ":name" => $name
    ));
    $rows = $statement->fetchAll(PDO::FETCH_ASSOC);
}

echo json_encode($rows[0]);

?>
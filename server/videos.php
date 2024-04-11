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

if(isset($_GET["search"])) {
    $search = $_GET["search"];
    $statement = $pdo->prepare("SELECT * FROM videos WHERE titre LIKE :search OR description LIKE :search");
    $statement->execute(array(
        ":search" => "%".$search."%"
    ));
    $rows = $statement->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($rows);
} else {
    if(isset($_GET["auth_id"])) {
        $auth_id = $_GET["auth_id"];
        $statement = $pdo->prepare("SELECT * FROM videos WHERE auth_id=:auth_id");
        $statement->execute(array(
            ":auth_id" => $auth_id
        ));
        $rows = $statement->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($rows);
    }
    else {
        if(isset($_GET["categorie"])) {
            $categorie = $_GET["categorie"];
            $statement = $pdo->prepare("SELECT * FROM videos WHERE categorie=:categorie");
            $statement->execute(array(
                ":categorie" => $categorie
            ));
            $rows = $statement->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($rows);
        }
        else {
            if(isset($_GET["id"])) {
                $export_array = array();
                $id = $_GET["id"];

                $statement = $pdo->prepare("SELECT * FROM videos WHERE id=:id LIMIT 1");
                $statement->execute(array(
                    ":id" => $id
                ));
                $rows = $statement->fetchAll(PDO::FETCH_ASSOC);
                foreach ($rows[0] as $key => $value) {
                    $export_array[$key] = $value;
                }

                $statement = $pdo->prepare("SELECT * FROM users WHERE id=:auth_id LIMIT 1");
                $statement->execute(array(
                    ":auth_id" => $rows[0]["auth_id"]
                ));
                $rows_2 = $statement->fetchAll(PDO::FETCH_ASSOC);
                foreach ($rows_2[0] as $key => $value) {
                    if($key != "id" and $key != "password" and $key != "description") {
                        $export_array[$key] = $value;
                    }

                }

                echo json_encode($export_array);

            }
            else {
                $statement = $pdo->prepare("SELECT * FROM videos");
                $statement->execute();
                $rows = $statement->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($rows);
            }
        }
    }
}

?>
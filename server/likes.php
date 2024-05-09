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

if(isset($_GET["add"]) && isset($_GET["auth_id"]) && isset($_GET["video_id"])) {
    $auth_id = secured($_GET["auth_id"]);
    $video_id = secured($_GET["video_id"]);
    $statement = $pdo->prepare("INSERT INTO likes (id, auth_id, video_id) VALUES (0, :auth_id, :video_id)");
    $statement->execute(array(
        ":auth_id"=>$auth_id,
        ":video_id" => $video_id,
    ));
    echo "OK";
} 

if(isset($_GET["remove"]) && isset($_GET["auth_id"]) && isset($_GET["video_id"])) {
    $auth_id = secured($_GET["auth_id"]);
    $video_id = secured($_GET["video_id"]);
    $statement = $pdo->prepare("DELETE FROM likes WHERE video_id=:video_id AND auth_id=:auth_id");
    $statement->execute(array(
        ":auth_id"=>$auth_id,
        ":video_id" => $video_id,
    ));
    echo "OK";
} 

if(isset($_GET["get"]) && isset($_GET["auth_id"]) && isset($_GET["video_id"])) {
    $auth_id = secured($_GET["auth_id"]);
    $video_id = secured($_GET["video_id"]);
    $statement = $pdo->prepare("SELECT * FROM likes WHERE video_id=:video_id AND auth_id=:auth_id LIMIT 1");
    $statement->execute(array(
        ":auth_id"=>$auth_id,
        ":video_id" => $video_id,
    ));
    $rows = $statement->fetchAll(PDO::FETCH_ASSOC);
    echo count($rows);
}

if(isset($_GET["getUser"]) && isset($_GET["auth_id"])) {
    $auth_id = secured($_GET["auth_id"]);
    $statement = $pdo->prepare("SELECT * FROM likes WHERE auth_id=:auth_id");
    $statement->execute(array(
        ":auth_id"=>$auth_id,
    ));
    $rows = $statement->fetchAll(PDO::FETCH_ASSOC);
    $export_array = array();

    foreach ($rows as $row) {
        $statement2 = $pdo->prepare("SELECT * FROM videos WHERE id=:video_id");
        $statement2->execute(array(
            ":video_id"=>$row["video_id"],
        ));
        $rows2 = $statement2->fetchAll(PDO::FETCH_ASSOC);
        $export_array[] = $rows2[0];
    }

    echo json_encode($export_array);
}

if(isset($_GET["getVideo"]) && isset($_GET["video_id"])) {
    $video_id = secured($_GET["video_id"]);
    $statement = $pdo->prepare("SELECT * FROM likes WHERE video_id=:video_id");
    $statement->execute(array(
        ":video_id"=>$video_id,
    ));
    $rows = $statement->fetchAll(PDO::FETCH_ASSOC);
    echo count($rows);
}
?>
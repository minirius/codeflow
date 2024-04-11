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

if(isset($_GET["add"]) && isset($_GET["auth_id"]) && isset($_GET["video_id"]) && isset($_GET["text"])) {
    $auth_id = secured($_GET["auth_id"]);
    $video_id = secured($_GET["video_id"]);
    $text = secured($_GET["text"]);
    $statement = $pdo->prepare("INSERT INTO comments (id, auth_id, video_id, text) VALUES (0, :auth_id, :video_id, :text)");
    $statement->execute(array(
        ":auth_id"=>$auth_id,
        ":video_id" => $video_id,
        ":text" => $text,
    ));
    echo "OK";
} 
if(isset($_GET["get"]) && isset($_GET["video_id"])) {
    $video_id = $_GET["video_id"];
    $export_array = array();

    $statement = $pdo->prepare("SELECT * FROM comments WHERE video_id=:video_id");
    $statement->execute(array(
        ":video_id" => $video_id
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

?>
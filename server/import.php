<?php

$str = file_get_contents('http://127.0.0.1/video.json');
$json = json_decode($str, true);

$pdo = new PDO("mysql:host=localhost;dbname=codeflow", 'marius', 'codeflow1234');

foreach ($json['categories'] as $rows) {
    foreach ($rows['videos'] as $row) {
        echo "<pre>".print_r($row)."</pre>";
    
        $statement = $pdo->prepare("INSERT INTO videos (id, titre, description, video, categorie, thumbnail, auth_id, likes, shares, views) VALUES (0, :titre, :description, :video, :categorie, :thumbnail, :auth_id, :likes, :shares, :views)");
        $statement->execute(array(
            ":titre" => $row["title"],
            ":description" => $row["description"],
            ":video" => $row["sources"][0],
            ":categorie" => $rows["name"],
            ":thumbnail" => $row["miniature"],
            ":auth_id"=>5,
            ":likes"=>0,
            ":shares"=>0,
            "views"=>0
        ));
    }
}
?>
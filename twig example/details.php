<?php


// this is the import that makes sure twig is active and we have access to it
require_once __DIR__.'/bootstrap.php';
// get db stuff
require_once __DIR__.'/database.php';

$db = new Db();

// display the animal, given their ID in the GET query
if(isset($GET['animalID'])){
$animalID = $db -> quote($_GET["animalID"]);

$animal = $database ->  select("
    SELECT a.id, a.image, a.name as animalName, a.bio, t.name as typeName 
    FROM animals a INNER JOIN type t on a.type = t.id 
    ORDER BY rescued DESC
    WHERE a.id == $animalID");
} else {
    // render the 404 page
    $twig->render("404.html", ['animal' => $result]);
}

if(count($animal) > 0){
    // get the first element in the array, and encode the object
    $result = [
        'id'        => $animal[0]['id'],
        'name'      => $animal[0]['name'],
        'type'      => $animal[0]['type'],
        'images'    => $animal[0]['images'],
        'bio'       => $animal[0]['bio'],
        'age'       => $animal[0]['age']
    ]
    

    $twig->render("details.html", ['animal' => $result]);
} else {
    // render the 404 page
    $twig->render("404.html", ['animal' => $result]);

}
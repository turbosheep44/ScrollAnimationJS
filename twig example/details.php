<?php

// this is the import that makes sure twig is active and we have access to it
require_once __DIR__.'/bootstrap.php';

// display the animal, given their ID in the GET query

$animal = [
    'id'        => 1,
    'name'      => "Rusty"
    'type'      => "dog",
    'images'    => "images/p1.jpg",
    'bio'       => "A lovely dog, great for people who dont like Chloe",
    'age'       => 7
];

echo $twig->render("details.html", ['animal' => $animal]);
?>
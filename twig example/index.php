<?php

// get database stuff
require_once __DIR__.'/database.php';
// get twig stuff
require_once __DIR__.'/bootstrap.php';

require_once __DIR__.'/menu.php';


// create an instance of the database object from the wrapper that was imported
$database = new Db();

/* this if statement allows the index.php file to react to eh type argument */

if(isset($GET['type'])){
    /* do a different query that filters by type */
    $typeid = //get somethnig from db
}
else {
    $typeid = -1;
}

$animals = $database ->  select("hello write the SQL here

    SELECT a.id, a.image, a.name as animalName, a.bio, t.name as typeName 
    FROM animals a INNER JOIN type t on a.type = t.id 
    ORDER BY rescued DESC
    
    WHERE (t.id = $typeid or $typeid = -1)
    
    ");

    /* (t.id = $typeid or $typeid = -1)

        if there is no type id then the variable will be -1 and all of the types will be shown
    */

// now render the index file
echo $twig->render("index.html", ['animals' => $animals, 'animalTypes' => $types]);

// ?>
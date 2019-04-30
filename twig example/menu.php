 <?php

/*  this thing is gonna do the  */
// get database stuff
require_once __DIR__.'/database.php';
// get twig stuff
require_once __DIR__.'/bootstrap.php';

// create an instance of the database object from the wrapper that was imported
$database = new Db();

$types = $database ->  select("sql to get the types from the database");

 ?>
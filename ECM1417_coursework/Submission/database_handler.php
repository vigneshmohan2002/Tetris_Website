<?php
    const DB_SERVER = 'localhost'; // Fill in
    const DB_USERNAME = 'viggy2002';  // Fill in
    const DB_PASSWORD = 'password';  // Fill in
    const DB_DATABASE = 'tetris';
    $db = mysqli_connect(DB_SERVER,DB_USERNAME,DB_PASSWORD,DB_DATABASE);
    if (mysqli_connect_errno())
    {
        $error = "Failed to connect to MySQL: " . mysqli_connect_error();
        $db = null; // Issue arising from this is handled in login-inc.php
    }

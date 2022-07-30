<?php
    include_once 'header.php';
    const DB_SERVER = 'localhost'; // Fill in
    const DB_USERNAME = 'viggy2002';  // Fill in
    const DB_PASSWORD = 'password';  // Fill in
    const DB_DATABASE = 'tetris';
    $db = mysqli_connect(DB_SERVER,DB_USERNAME,DB_PASSWORD,DB_DATABASE);
    if(isset($_SESSION['user'])) // Does nothing if no one is logged in
    {
        $user = $_SESSION['user'];
        $insert_user_query = "SELECT Display FROM Users WHERE UserName = $user;";
        if (mysqli_fetch_array(mysqli_query($db, $insert_user_query))[0] == 1)
        {
            if (isset($_POST['score'])) // Sent to index page from register.php via the register button.
            {
                // make action leaderboard.php with method post in tetris.js
                $score = $_POST['score'];
                $insert_user_query = "INSERT INTO Scores VALUES (?, ?);";
                $stmt = mysqli_stmt_init($db);
                mysqli_stmt_prepare($stmt, $insert_user_query);
                mysqli_stmt_bind_param($stmt, 'si', $user, $score);
                mysqli_stmt_execute($stmt);
            }
        }
    }
    $leaderboard_data = mysqli_query($db, "SELECT * FROM Scores;");
    echo"<div class = leaderboard>";
    echo "
        <table class = leaderboard>
            <tr>
            <th>Username</th>
            <th>Score</th>
            </tr>";
    while($row = mysqli_fetch_array($leaderboard_data)) {
        echo "
        <tr>
            <td> $row[1]</td>
            <td> $row[2]</td>
        </tr>";
        }
    echo "</div>";
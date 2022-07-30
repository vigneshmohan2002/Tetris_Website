<?php
    session_start();
    // This can be moved to index if needed. Would be ugly but it is what it is. Literally just need to copy paste
    // into the start and make the forms call index.php itself
    if (isset($_POST["log-in"])) // Launched by button
    {
        $db = null;
        require "database_handler.php";
        $username = $_POST["uname"];
        $password = $_POST["passwd"];
        if(!is_null($db))
        {
            $sql = "SELECT * FROM Users WHERE UserName = '$username' AND Password = '$password'";
        }
        else // Database connection failed
        {
            header("location: /index.php?error=connection-failure");
            exit();
        }
        $result = mysqli_query($db,$sql);  // Returns false if nothing is found
        $row = mysqli_fetch_assoc($result); // Fetches an array from the query result
        // will always only contain one row since UserName is UNIQUE
        // If the UserName and Password combo doesn't exist result will simply be false
        // For security reasons, no need to know if only one of UserName is correct
        if(!is_null($row))
        {
            $_SESSION['user'] = $username;
            $output = $_SESSION['user'];
            header("location: /index.php");
            // It is redirected back to index, but now _SESSION['user'] is set
        }
        else
        {
            // UserName or Password is wrong so invalid credentials.
            header("location: /index.php?error=invalid-creds-failure");
        }
        exit();
    }
    else
    {
        // If the user tries to access this area by changing the url and not via button
        header("location: /index.php");
    }
exit();

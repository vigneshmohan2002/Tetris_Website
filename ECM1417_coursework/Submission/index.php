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
	session_start();
	include_once 'header.php';
	if($_GET['session'] == 'destroy') // Logout button for debugging purposes. Easily removed if needed
	{
		session_destroy();
		header("location: /index.php");
	}
	if(isset($_POST['register'])) // Sent to index page from register.php via the register button.
	{
		$new_password = $_POST['passwd'];
		$new_confirm_password = $_POST['conf_passwd'];
		if (is_null($new_password) or is_null($new_confirm_password)) {
			header("location: /register.php?error=password-not-null");
			exit();
		}
		if ($new_password != $new_confirm_password) {
			header("location: /register.php?error=passwords-no-match");
			exit();
		}
		$new_username = $_POST['uname'];
		$new_f_name = $_POST['f-name'];
		$new_l_name = $_POST['l-name'];
		$disp = $_POST['display'];
		if (is_null($new_username) or is_null($new_f_name) or is_null($new_l_name)) {
			header("location: /register.php?error=empty-field");
			exit();
		}
		if (!preg_match("/^[a-zA-Z ]*$/", $new_f_name) or !preg_match("/^[a-zA-Z ]*$/", $new_l_name))
		{
			header("location: /register.php?error=invalid-name");
			exit();
		}
		// Only reaches here if no errors due to exit statements.
		if(!is_null($db))
		{
			print("correct");
			// Database connection successfully established
			$insert_user_query = "INSERT INTO Users VALUES (?, ?, ?, ?, ?);";
			$stmt = mysqli_stmt_init($db);
			mysqli_stmt_prepare($stmt, $insert_user_query);
			mysqli_stmt_bind_param($stmt,'ssssi',$new_username, $new_f_name, $new_l_name, $new_password, $disp);
			mysqli_stmt_execute($stmt);
			header("location: /index.php?registration=success");
		}
		else // Database connection failed
		{
			header("location: /register.php?error=connection-failure");
		}
		exit();
	}
	if(isset($_SESSION['user'])) // Logged in
		{
			// Display the welcome message 'Welcome to Tetris'
			// Button saying 'Click here to play' that links to tetris.php page
			$USER = $_SESSION['user'];
			echo "
			<div class = lander>
			<p> Welcome to Tetris </p>
			<form action=\"/tetris.php\">
				<input type=\"submit\" value=\"Click here to play\" />
			</form>
			<form action=\"/logout.php\">
				<input type=\"submit\" value=\"logout\" />
			</form>
			</div>
			<!--The following tag closes the main div in header.php-->
			</div>
			";

		}
	else // Not logged in
		{
			// Let them log in using a form

			echo "			
			<div class = lander>
				<form action=\"login-inc.php\" method=\"post\">
					Username: <input type=\"text\" name=\"uname\" style=\"width: 2cm\" placeholder=\"username\"><br>
					Password: <input type=\"password\" name=\"passwd\" style=\"width: 2cm\"><br>
					<input type=\"submit\" name=\"log-in\" value=\"Log in\">
				</form>
				<p> Don't have a user account? <a href=\"/register.php\">Register Now</a></p>
			</div>
			<!--The following tag closes the main div in header.php-->
			</div>";
			if ($_GET['registration'] == "success")
			{
				echo "Registration was successful!";
			}
		}
	switch ($_GET["error"])
	{
		case ("connection-failure"):
			// DO something
			echo "Failed to connect to the database.";
			break;
		case ("invalid-creds-failure"):
			// Do something
			echo "Invalid Username or password";
			break;
	}
?>


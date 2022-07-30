<?php
session_start();
include_once 'header.php';
// This webpage shouldn't be accessed if the user is logged in, however the user could access it by changing the url.
// I don't think it's possible to restrict access due to project spec.
echo "
			<div class = registration>
				<form action=\"index.php\" method=\"post\">
				    First Name: <input type=\"text\" name=\"f-name\" style=\"width: 2cm\" placeholder=\"username\"><br>
				    Last name: <input type=\"text\" name=\"l-name\" style=\"width: 2cm\" placeholder=\"username\"><br>
					Username: <input type=\"text\" name=\"uname\" style=\"width: 2cm\" placeholder=\"username\"><br>
					Password: <input type=\"password\" name=\"passwd\" style=\"width: 2cm\"><br>
					Confirm Password: <input type=\"password\" name=\"conf_passwd\" style=\"width: 2cm\"><br>
					
					'Display Scores on leaderboard: <input type=\"radio\" id=\"disp-yes\" name=\"display\" value= 1>
                      <label for=\"yes\">Yes</label>
					<input type=\"radio\" id=\"disp-no\" name=\"display\" value= 0 checked>
                      <label for=\"no\">No</label> <br>
					<input type=\"submit\" name=\"register\" value=\"Register\">
				</form>
			</div>
			<!--The following tag closes the main div in header.php-->
			</div>";
switch ($_GET["error"])
{
    case ("passwords-no-match"):
        // DO something
        echo "Please make sure your passwords match.";
        break;
    case ("connection-failure"):
        // DO something
        echo "Failed to connect to the database.";
        break;
    case (""):
        // Do something
        echo "";
        break;
}
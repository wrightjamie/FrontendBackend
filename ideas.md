The Login page and modal will have a "Register" link. 
This will take users to a registration page. 
We'll capture username, name, email, and password.
The user will not become active until an admin approves them.
We need a way to alert the admin of new users.
Users need a way to change their password when logged in.
The admin will be able to change user passwords - this is how we'll deal with forgotten passwords.
Ideally, resetting the admin password will require a password reset code sent to the admin's email. How do we do e-mail without significant dependencies? I want minimal dependencies. I don't want to have to set up an additional server for SMTP. Give me options for this. I'm happy if the final answer requires manual editting of the user.db to remove the admin password. This could be used to trigger a password reset.
We'll make use of our admin data tables to show users and allow editing etc.

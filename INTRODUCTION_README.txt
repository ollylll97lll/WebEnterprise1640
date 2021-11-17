Here are introduction to run the website on localhost

1. Make sure your computer have install Nodejs. 

2. Open the file in your IDE

2. On the IDE open command and move to frontend by command "cd frontend" and run npm i to install all library as well as packet of the frontend site

2.1 Run back to your root folder by "cd .." on command line

3. On the IDE open command and move to server by command "cd server" and run npm i to install all library as well as packet of the server site

3.1 Run back to your root folder by "cd .." on command line

4. after run all of that you need to do last setup to make sure your application can run at the server

you need to create new file at the server name it .env

this .env file are the important file in order to run this application.

here are the .env on the server, please copy it before run the application.

========================

DB_USERNAME=webenterprise1640
DB_PASSWORD=webenterprise1640
ACCESS_TOKEN_SECRET = webenterprise1640Of4peopleandLongDepTrai

CLIENT_URL = http://localhost:3000/

MAILING_SERVICE_CLIENT_ID = 747060213274-p5tag4lltn5r0i95tpkg34nk8p7c7jqh.apps.googleusercontent.com
MAILING_SERVICE_CLIENT_SECRET = zd1xDhoHyP5IBHKmFO-q4z_L
MAILING_SERVICE_REFESH_TOKEN = 1//04Am1U_qEmn1rCgYIARAAGAQSNwF-L9IrKnRyNZ_J9QOz75InXVUq8oUTbOMJkYtlIWrEPYGS8p17FTqxxpK-_ptIjziFtzwux1M
SENDER_EMAIL_ADDRESS = enterprise.web1640@gmail.com

========================

After you add the .env file the rest is run "cd server" and run "npm run devStart" at the commandline to start the server.

If the server say you mongoDB connect mean your server is ready to run.

Next you need to open a new commandline because the previous commandline now run the server

By opening the new commandline you need access to frontend by "cd frontend"

After that you need to run "npm start" in order to run the website. wait until the website show up and you done.



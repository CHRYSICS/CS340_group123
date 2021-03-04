# CS340_group123
Group Project for Job Board Database

To setup (and not need to download 'node_modules'):
1. copy all files except node_modules to local project directory
2. Install Nodejs & npm if not already down
3. In project directory, enter in terminal: 'npm install'
This will install all dependencies needed via package.json

To setup:
1. pull git repo into local directory
2. in the main project folder, run "npm install" (this installs node modules in local directory)
3. Because this node version needs to work with the school server, the modules are set to work under these conditions. This means that there is an old bug in the handlebars modules (fix this by going to the file where the error occurs and remove the comma [ask need assistance changing])
4. Once the bug is fixed, the application should be ready to run.

To run:
node server.js {port number}

Note: './config/dbcon.js' contains example log-in information for connecting to database. Change info to connect to different database.

Note: './config/schema.js' contains the schema for the project. Upload this to database to initalize 
tables first. This has already been down for the example database provided. 

# How to deploy to Oracle cloud from Dev Cloud

Create a new build and configure as follows.

## Add Git repository
Use the repository of your project and specify branch

## Build steps

### Execute Shell Command: npm install --production

### Execute Shell Command: zip -r app1.zip *

### Execute Shell Command: chmod 777 deploy.sh

### Execute Shell Command: ./deploy.sh [domain] [user] [password] App1 app1.zip

Finally run Build Now to deploy on the Application Container cloud.

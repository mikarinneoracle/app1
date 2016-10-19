# How to deploy to Oracle cloud from Dev Cloud

Create a new build and configure as follows.

## Add Git repository
Use the repository of your project and specify branch.

## Build steps

### Execute Shell Command: npm install --production

### Execute Shell Command: zip -r app1.zip *

### Execute Shell Command: chmod 777 deploy.sh

### Execute Shell Command: ./deploy.sh [domain] [user] [password] App1 app1.zip

Finally run Build Now to deploy on the Application Container cloud.

# How to test DB Cloud database connectivity

## Configure database connection to App1 in Application Container service console

### Under App1 deployments tab add Service Bindings and specify you DB Cloud instance.

Save and redeploy.

## Test via browser http(s)://[App1 url]/connect

Should return the connection string when successful, otherwise shows the ORA error.

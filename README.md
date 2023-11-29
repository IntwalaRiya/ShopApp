## Project Overview

This project has undergone scaling from a local environment to AWS infrastructure, with the backend entirely migrated to AWS services. The full-stack web application is now hosted on AWS EC2 instance. 

For detailed information on the project and its components, please refer to the [repository](https://github.com/moelashmawy/inventory-application/tree/master).

![ShopApp Application Architecture Diagram](<Shop App Architecture Diagram.jpg>)

Changes done in this project:
The backend code has been transformed to Python 3.7, moving away from Node.JS. The database has been switched to AWS DynamoDB, and the login module now utilizes AWS Secrets Manager. Static images have been enhanced and are now hosted on S3 Buckets. AWS SNS is employed for efficient notification management. 
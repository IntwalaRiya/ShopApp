import json
import boto3

def lambda_handler(event, context):
    dynamodb = boto3.client('dynamodb')
    data = event["body"]
    email = data["email"]
    password = data["password"]
    
    # Retrieve the secret value from Secrets Manager
    secrets_client = boto3.client('secretsmanager')
    response = secrets_client.get_secret_value(
        SecretId='ShopAppCredentials'
    )

    # Parse the secret value into a dictionary
    secret_value = response['SecretString']
    secret_data = json.loads(secret_value)
    
    for key, value in secret_data.items():
        if key == email:
            # Input email matches a key-value pair
            if value == password:
                # Password also matches
                user = dynamodb.get_item(
                    TableName='UserDetails',  # Replace with your table name
                    Key={'Email':{'S':email}}
                )
                print(user)
                return {
                    'statusCode': 200,
                    'body': 'Login Credentials are valid',
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'user': user['Item']
                }
            else:
                # Password does not match
                return {
                    'statusCode': 500,
                    'body': 'Invalid password',
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                }

    # No matching key-value pair found
    return {
        'statusCode': 500,
        'body': 'No matching data found',
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
    }
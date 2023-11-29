import json
import boto3

dynamodb = boto3.resource('dynamodb')
dynamodb_client = boto3.client('dynamodb')
table = dynamodb.Table('UserDetails')
secrets_client = boto3.client('secretsmanager')

def lambda_handler(event, context):
    print(event)
    try:
        data = event['body']
        response = secrets_client.get_secret_value(
            SecretId='ShopAppCredentials'
        )
        
        secret_value = response['SecretString']
        secret_data = json.loads(secret_value)
        
        secret_data[data['email']] = data['password']
        
        # Convert the updated secret data back to a JSON string
        updated_secret_value = json.dumps(secret_data)
        
        # Update the secret in Secrets Manager
        response = secrets_client.update_secret(
            SecretId='ShopAppCredentials',
            SecretString=updated_secret_value
        )
        
        params = {
            'TableName': 'UserDetails',
            'Item': {
                'Email': data['email'],
                'Username': data['username'],
                'Firstname': data['firstname'],
                'Lastname': data['lastname'],
                'Gender': '-',
                'Nationality': '-',
                'BirthDate': '-',
                'isAdmin': False,
                'isSeller': False,
                'isCustomer': True,
                'isShipper': False,
                'isRestricted': False
                # Add other attributes as needed
            },
        }
        
        table.put_item(Item=params['Item'])

        user = dynamodb_client.get_item(
                TableName='UserDetails',  # Replace with your table name
                Key={'Email':{'S':data['email']}}
        )
        response = {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': 'User data added successfully',
            'user': user['Item']
        }
        
    except Exception as e:
        print(f'Error: {e}')
        response = {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': 'Error adding user data'
        }

    return response
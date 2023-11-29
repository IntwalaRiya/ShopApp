import json
import boto3

def lambda_handler(event, context):
    
    # Retrieveing JSON data, received from POST API
    print(event)
    # data = json.loads(event['body'])
    password = event['password']
    # print(data)
    event.pop('password')
    print(event)
    # Creating DynamoDB Resource
    dynamodb = boto3.resource('dynamodb')
    dynamodb_client = boto3.client('dynamodb')

    table = dynamodb.Table("UserDetails")

    try:
        for key, value in event.items():
            if key == 'isSeller' and value == 'Yes':
                response = table.update_item(
                    Key={
                        'Email': event['Email']
                    },
                    UpdateExpression=f'SET {key} = :val1',
                    ExpressionAttributeValues={
                        ':val1': {'BOOL': True}
                    }
                )
            elif key == 'isSeller' and value == 'No':
                response = table.update_item(
                    Key={
                        'Email': event['Email']
                    },
                    UpdateExpression=f'SET {key} = :val1',
                    ExpressionAttributeValues={
                        ':val1': {'BOOL': False}
                    }
                )
            elif key != 'Email' and key!= 'password':
                response = table.update_item(
                    Key={
                        'Email': event['Email']
                    },
                    UpdateExpression=f'SET {key} = :val1',
                    ExpressionAttributeValues={
                        ':val1': value
                    }
                )
        
        secrets_manager = boto3.client('secretsmanager')

        response = secrets_manager.put_secret_value(
            SecretId='ShopAppCredentials',
            SecretString=f'{{"{event["Email"]}": "{password}"}}'
        )

        
        user = dynamodb_client.get_item(TableName='UserDetails', Key={'Email':{'S':event['Email']}})
        print(user['Item'])
        response = {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': 'User data updated successfully',
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
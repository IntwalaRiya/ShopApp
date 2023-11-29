import json
import boto3

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    try:
        table = dynamodb.Table('UserDetails')
        user = table.scan()
        print(user)
        response = {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'message': 'All user data fetched successfully',
            'users': user['Items']
        }
    except:
        response = {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'message': 'Error fetching users data',
        }
    
    return response
import json
import boto3

def lambda_handler(event, context):
    dynamodb = boto3.client('dynamodb')
    try:
        wishlist = dynamodb.scan(
            TableName='Wishlist',
            ExpressionAttributeNames = {'#N': 'User' },
            FilterExpression='#N = :value',  # Replace 'ColumnName' with your actual attribute name
            ExpressionAttributeValues={':value': {'S': event['User']}}  # Assuming 'S' for string, adjust for other types
        )
        response = {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'message': 'All user data fetched successfully',
            'wishlist': wishlist['Items']
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
import json
import boto3

def lambda_handler(event, context):
    dynamodb = boto3.client('dynamodb')
    try:
        address = dynamodb.scan(
            TableName='UserAddress',
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
            'message': 'All user address data fetched successfully',
            'address': address['Items']
        }
    except:
        response = {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'message': 'Error fetching users address data',
        }
    
    return response
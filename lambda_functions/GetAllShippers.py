import json
import boto3

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    try:
        table = dynamodb.Table('Shipper')
        user = table.scan()
        response = {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'message': 'All shippers data fetched successfully',
            'shippers': user['Items']
        }
    except:
        response = {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'message': 'Error fetching shippers data'
        }
    
    return response
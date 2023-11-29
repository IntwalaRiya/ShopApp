import json
import boto3
import uuid

dynamodb = boto3.resource('dynamodb')
dynamodb_client = boto3.client('dynamodb')
table = dynamodb.Table('Wishlist')

def lambda_handler(event, context):
    print(event)
    try:
        params = {
            'TableName': 'Wishlist',
            'Item': {
                'WishlistID': str(uuid.uuid4()),
                'User': event['UserID'],
                'Product': event['ProductID']
            },
        }
        
        table.put_item(Item=params['Item'])
        
        wishlist = dynamodb_client.scan(
            TableName='ProductCategory',
            ExpressionAttributeNames = {'#N': 'User' },
            FilterExpression='#N = :value',  # Replace 'ColumnName' with your actual attribute name
            ExpressionAttributeValues={':value': {'S': event['UserID']}}  # Assuming 'S' for string, adjust for other types
        )
        
        response = {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'wishlist': wishlist['Items'],
            'message': 'Wishlist added successfully',
        }
        
    except Exception as e:
        print(f'Error: {e}')
        response = {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'message': 'Error adding to wishlist'
        }
    return response
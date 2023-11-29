import json
import boto3
import uuid

dynamodb = boto3.resource('dynamodb')
dynamodb_client = boto3.client('dynamodb')
table = dynamodb.Table('Product')

def lambda_handler(event, context):
    print(event)
    try:
        data = event['product']
        data['ProductID'] = str(uuid.uuid4())
        for key, value in data.items():
            if value is None:
                data[key] = ''
        params = {
            'TableName': 'Product',
            'Item': {
                'ProductID': data['ProductID'],
                'Name': data['Name'],
                'Description': data['Description'],
                'Category': data['Category'],
                'Price': data['Price'],
                'NumberInStock': data['NumberInStock'],
                'Se': event['User']
            },
        }
        
        table.put_item(Item=params['Item'])
        
        response = {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'message': 'Product added successfully',
        }
        
    except Exception as e:
        print(f'Error: {e}')
        response = {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'message': 'Error adding product'
        }
    return response
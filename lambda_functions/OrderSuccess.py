import json
import boto3
import uuid
from datetime import datetime

dynamodb_r = boto3.resource('dynamodb')
table = dynamodb_r.Table('Order')
cart_table = dynamodb_r.Table('Cart')
dynamodb = boto3.client('dynamodb')

def lambda_handler(event, context):
    try:
        cart = dynamodb.scan(
            TableName='Cart',
            ExpressionAttributeNames = {'#N': 'User', '#Q': 'OrderState' },
            FilterExpression='#N = :value AND #Q.Pending = :statevalue',  # Replace 'ColumnName' with your actual attribute name
            ExpressionAttributeValues={':value': {'S': event['User']}, ':statevalue': {'BOOL': True}}  # Assuming 'S' for string, adjust for other types
        )
        
        totalPrice = 0
        for i in range(len(cart['Items'])):
            totalPrice += int(cart['Items'][i]['TotalPrice']['S'])
            
        if 'Items' in cart:
            for index in range(len(cart['Items'])):
                productdir = {
                    'ProductID': cart['Items'][index]['Product']['M']['ProductID']['S'],
                    'Name': cart['Items'][index]['Product']['M']["Name"]['S'],
                    'Description': cart['Items'][index]['Product']['M']["Description"]['S'],
                    'Category': cart['Items'][index]['Product']['M']["Category"]['S'],
                    'NumberInStock': cart['Items'][index]['Product']['M']["NumberInStock"]['S'],
                    'Price': cart['Items'][index]['Product']['M']["Price"]['S']
                }
                
                params = {
                    'OrderID': str(uuid.uuid4()),
                    'User': event['User'],
                    'Product': productdir,
                    'ShipDate': '2023-01-01',
                    'DeliveryDate': '2023-04-01',
                    'CartID': cart['Items'][index]['CartID']['S'],
                    'TotalPrice': cart['Items'][index]['TotalPrice']['S'],
                    'OrderDate': datetime.now().strftime('%Y-%m-%d')
                }
                
                table.put_item(Item=params)
                
                update_response = cart_table.update_item(
                    Key={'CartID': params['CartID']},
                    UpdateExpression='SET OrderState.Pending = :state',
                    ExpressionAttributeValues={':state': False}  # Use the modified product list here
                )
                
                update_response = cart_table.update_item(
                    Key={'CartID': params['CartID']},
                    UpdateExpression='SET OrderState.Confirmed = :state',
                    ExpressionAttributeValues={':state': True}  # Use the modified product list here
                )
                
            order = dynamodb.scan(
                TableName='Order',
                ExpressionAttributeNames = {'#N': 'User' },
                FilterExpression='#N = :value',  # Replace 'ColumnName' with your actual attribute name
                ExpressionAttributeValues={':value': {'S': event['User']}}  # Assuming 'S' for string, adjust for other types
            )
            print(order['Items'])
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'order': order['Items'],
                'cart': [],
                'TotalPrice': '0',
                'message': 'cart placed successfully'
            }
        else:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'message': 'No product found'
            }
    except:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'message': 'Error placing order'
        }
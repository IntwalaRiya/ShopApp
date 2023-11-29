import json
import boto3

dynamodb = boto3.client('dynamodb')

def lambda_handler(event, context):
    try:
        response = dynamodb.delete_item(
            TableName='Cart',
            Key={
                'CartID': {'S': event['CartID']}  # Assuming 'ID' is the primary key attribute name
            }
        )
        
        cart = dynamodb.scan(
            TableName='Cart',
            ExpressionAttributeNames = {'#N': 'User' },
            FilterExpression='#N = :value',  # Replace 'ColumnName' with your actual attribute name
            ExpressionAttributeValues={':value': {'S': event['User']}}  # Assuming 'S' for string, adjust for other types
        )
        totalPrice = 0
        for i in range(len(cart['Items'])):
            totalPrice += int(cart['Items'][i]['TotalPrice']['S'])
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'TotalPrice': totalPrice,
            'cart': cart['Items'],
            'message': 'product removed from cart successfully'
        }
    except:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'message': 'removing product from cart failed'
        }
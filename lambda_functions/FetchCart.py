import json
import boto3

def lambda_handler(event, context):
    dynamodb = boto3.client('dynamodb')
    
    try:
        cart = dynamodb.scan(
            TableName='Cart',
            ExpressionAttributeNames = {'#N': 'User' },
            FilterExpression='#N = :value',  # Replace 'ColumnName' with your actual attribute name
            ExpressionAttributeValues={':value': {'S': event['User']}}  # Assuming 'S' for string, adjust for other types
        )
        
        
        totalPrice = 0
        for i in range(len(cart['Items'])):
            print(cart['Items'][i])
            totalPrice += int(cart['Items'][i]['TotalPrice']['S'])
        print(totalPrice)
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'TotalPrice': str(totalPrice),
            'cart': cart['Items'],
            'message': 'cart fetched successfully'
        }
    except:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'message': 'cart fetching failed'
        }
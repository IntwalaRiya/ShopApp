import json
import boto3

dynamodb_r = boto3.resource('dynamodb')
table = dynamodb_r.Table('Cart')
dynamodb = boto3.client('dynamodb')

def lambda_handler(event, context):
    
    try:
        # response = dynamodb.get_item(TableName='Cart', Key={'CartID':{'S':event['CartID']}})
        
        update_response = table.update_item(
            Key={'CartID': event['CartID']},
            UpdateExpression='SET OrderQuantity = :products',
            ExpressionAttributeValues={':products': event['OrderQuantity']}  # Use the modified product list here
        )
        print(update_response)
        
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
            'cart': cart['Items'],
            'TotalPrice': totalPrice,
            'message': 'cart updated successfully'
        }
    # TODO implement
    except:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'message': 'cart updating failed'
        }
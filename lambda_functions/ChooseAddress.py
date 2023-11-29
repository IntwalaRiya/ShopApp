import json
import boto3

dynamodb_r = boto3.resource('dynamodb')
table = dynamodb_r.Table('Cart')
dynamodb = boto3.client('dynamodb')

def lambda_handler(event, context):
    
    try:
        # update_response = table.update_item(
        #     Key={'CartID': event['CartID']},
        #     UpdateExpression='SET Address = :address',
        #     ExpressionAttributeValues={':address': event['AddressID']}  # Use the modified product list here
        # )
        
        cart = dynamodb.scan(
            TableName='Cart',
            ExpressionAttributeNames = {'#N': 'User' },
            FilterExpression='#N = :value',  # Replace 'ColumnName' with your actual attribute name
            ExpressionAttributeValues={':value': {'S': event['User']}}  # Assuming 'S' for string, adjust for other types
        )
        
        for index in range(len(cart['Items'])):
            update_response = table.update_item(
                Key={'CartID': cart['Items'][index]['CartID']['S']},
                UpdateExpression='SET Address = :address',
                ExpressionAttributeValues={':address': event['AddressID']}  # Use the modified product list here
            )
        
        cart = dynamodb.scan(
            TableName='Cart',
            ExpressionAttributeNames = {'#N': 'User' },
            FilterExpression='#N = :value',  # Replace 'ColumnName' with your actual attribute name
            ExpressionAttributeValues={':value': {'S': event['User']}}  # Assuming 'S' for string, adjust for other types
        )
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'cart': cart['Items'],
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
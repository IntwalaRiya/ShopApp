import json
import boto3

def lambda_handler(event, context):
    
    # Retrieveing JSON data, received from POST API
    AddressID = event['AddressID']
    print(event)
    # Creating DynamoDB Resource
    dynamodb = boto3.resource('dynamodb')
    dynamodb_client = boto3.client('dynamodb')

    table = dynamodb.Table("UserAddress")

    try:
        for key, value in event.items():
            if key != 'AddressID':
                response = table.update_item(
                    Key={
                        'AddressID': AddressID
                    },
                    ExpressionAttributeNames = {'#N': key },
                    UpdateExpression=f'SET #N = :val1',
                    ExpressionAttributeValues={
                        ':val1': value
                    }
                )
                
        address = dynamodb_client.get_item(TableName='UserAddress', Key={'AddressID':{'S':AddressID}})
        response = {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'message': 'Message updated successfully',
            'address': address
        }
    except Exception as e:
        print(f'Error: {e}')
        response = {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'message': 'Error updating address'
        }
    return response
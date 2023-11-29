import json
import boto3

def lambda_handler(event, context):
    
    # Retrieveing JSON data, received from POST API
    ProductID = event['ProductID']
    print(event)
    # Creating DynamoDB Resource
    dynamodb = boto3.resource('dynamodb')
    dynamodb_client = boto3.client('dynamodb')

    table = dynamodb.Table("Product")

    try:
        for key, value in event.items():
            if key != 'ProductID':
                response = table.update_item(
                    Key={
                        'ProductID': ProductID
                    },
                    ExpressionAttributeNames = {'#N': key },
                    UpdateExpression=f'SET #N = :val1',
                    ExpressionAttributeValues={
                        ':val1': value
                    }
                )
                
        product = dynamodb_client.get_item(TableName='Product', Key={'ProductID':{'S':ProductID}})
        response = {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': 'Product updated successfully',
            'product': product
        }
    except Exception as e:
        print(f'Error: {e}')
        response = {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': 'Error updating product'
        }
    return response
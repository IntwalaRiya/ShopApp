import json
import boto3

def lambda_handler(event, context):
    
    # Retrieveing JSON data, received from POST API
    CategoryID = event['CategoryID']
    print(event)
    # Creating DynamoDB Resource
    dynamodb = boto3.resource('dynamodb')
    dynamodb_client = boto3.client('dynamodb')

    table = dynamodb.Table("ProductCategory")

    try:
        for key, value in event.items():
            if key != 'CategoryID':
                response = table.update_item(
                    Key={
                        'CategoryID': CategoryID
                    },
                    ExpressionAttributeNames = {'#N': key },
                    UpdateExpression=f'SET #N = :val1',
                    ExpressionAttributeValues={
                        ':val1': value
                    }
                )
                
        category = dynamodb_client.get_item(TableName='ProductCategory', Key={'CategoryID':{'S':CategoryID}})
        response = {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': 'Category data updated successfully',
            'category': category
        }
    except Exception as e:
        print(f'Error: {e}')
        response = {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': 'Error updating category'
        }
    return response 
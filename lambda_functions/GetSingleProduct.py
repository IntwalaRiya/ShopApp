import json
import boto3

def lambda_handler(event, context):
    ProductID = event['ProductID']
    
    # DynamoDB table details
    dynamodb = boto3.client('dynamodb')

    try:
        # Retrieve data from DynamoDB based on the provided ID
        response = dynamodb.get_item(TableName='Product', Key={'ProductID':{'S':ProductID}})

        # Check if the item was found
        if 'Item' in response:
            # Item found, return the data
            product = response['Item']
            name = product['Category']['S']

            # response = dynamodb.get_item(TableName='Product', Key={'Category':{'S':name}})
            response = dynamodb.scan(
                TableName='ProductCategory',
                ExpressionAttributeNames = {'#N': 'Name' },
                FilterExpression='#N = :value',  # Replace 'ColumnName' with your actual attribute name
                ExpressionAttributeValues={':value': {'S': name}}  # Assuming 'S' for string, adjust for other types
            )
            # print(response)

            product['CategoryID'] = response['Items'][0]['CategoryID']['S']

            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'product': product
            }
        else:
            # Item not found
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'message': 'Product not Found'
            }

    except Exception as e:
        # Handle errors
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'message': 'Error while searching'
        }
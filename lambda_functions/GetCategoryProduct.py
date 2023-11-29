import json
import boto3

def lambda_handler(event, context):
    CategoryID = event['CategoryID']
    
    # DynamoDB table details
    dynamodb = boto3.client('dynamodb')

    try:
        # Retrieve data from DynamoDB based on the provided ID
        response = dynamodb.get_item(TableName='ProductCategory', Key={'CategoryID':{'S':CategoryID}})

        # Check if the item was found
        if 'Item' in response:
            # Item found, return the data
            category = response['Item']
            name = category['Name']['S']
            print(name)
            
            # response = dynamodb.get_item(TableName='Product', Key={'Category':{'S':name}})
            response = dynamodb.scan(
                TableName='Product',
                FilterExpression='Category = :value',  # Replace 'ColumnName' with your actual attribute name
                ExpressionAttributeValues={':value': {'S': name}}  # Assuming 'S' for string, adjust for other types
            )
            print(response)

            
            if 'Items' in response:
                product = response['Items']
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'category': category,
                    'products': product
                }
                
            else:
                return {
                    'statusCode': 500,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'message': 'product not found'
                }
        else:
            # Item not found
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'message': 'Category not Found'
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
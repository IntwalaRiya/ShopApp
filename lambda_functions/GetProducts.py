import json
import boto3

def lambda_handler(event, context):
    print(event)
    page = int(event['page']) if 'page' in event else 1
    per_page = int(event['perPage']) if 'perPage' in event else 8

    dynamodb = boto3.resource('dynamodb')

    scan_params = {
        'FilterExpression': 'NumberInStock <> :val',
        'ExpressionAttributeValues': {':val': 0},
        'Limit': per_page
    }
    print(scan_params)

    table = dynamodb.Table("Product")
    try:
        # products = table.scan()['Items']
        response = table.scan(**scan_params)

        if 'LastEvaluatedKey' in response:
            last_evaluated_key = response['LastEvaluatedKey']
        else:
            last_evaluated_key = None
        
        result = {
            'products': response.get('Items', []),
            'pagesCount': last_evaluated_key
        }
        print(result)
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'products': result['products'],
            'pagesCount': result['pagesCount']
        }
    
    except:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'message': 'Error fetching data',
        }
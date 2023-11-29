import json
import boto3

dynamodb = boto3.client('dynamodb')

def lambda_handler(event, context):
    
    try:
        if event['Email'] is not None:
            user = dynamodb.get_item(TableName='UserDetails', Key={'Email':{'S':event['Email']}})
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'user': user['Item'],
                'message': 'user found'
            }
        else:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'message': 'not login'
            }
           
    except:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'message': 'finding user failed'
        }
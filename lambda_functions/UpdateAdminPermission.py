import json
import boto3
import uuid

def lambda_handler(event, context):
    print(event)
    dynamodb = boto3.resource('dynamodb')
    dynamodb_client = boto3.client('dynamodb')

    table = dynamodb.Table("UserDetails")
    
    try:
        response = table.update_item(
            Key={
                'Email': event['Email']
                },
            UpdateExpression=f'SET isAdmin = :val1',
            ExpressionAttributeValues={
                ':val1': event['isAdmin']
                }
            )

        user = dynamodb_client.get_item(TableName='UserDetails', Key={'Email':{'S':event['Email']}})
        response = {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'message': 'Admin permission updated successfully',
                'user': user
            }
    except Exception as e:
        print(f'Error: {e}')
        response = {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'message': 'Error updating admin permission'
        }
    return response
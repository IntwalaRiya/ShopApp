import json
import boto3
import uuid
def lambda_handler(event, context):
    print(event)
    dynamodb = boto3.resource('dynamodb')
    dynamodb_client = boto3.client('dynamodb')
    sns = boto3.client('sns')
    # isShipper = 'isShipper'
    table = dynamodb.Table("UserDetails")
    
    try:
        response = table.update_item(
            Key={
                'Email': event['Email']
                },
            UpdateExpression=f'SET isShipper = :val1',
            ExpressionAttributeValues={
                ':val1': event['isShipper']
                }
            )
        if event['isShipper'] == True:

            # Subscribe the email address to the SNS topic
            response = sns.subscribe(
                TopicArn='arn:aws:sns:us-east-1:408430723340:ShipperNotificationSNS',
                Protocol='email',
                Endpoint=event['Email']
            )
        params = {
            'Email': event['Email'],
            'ShipperID': str(uuid.uuid4()),
        }
        table = dynamodb.Table('Shipper')
        table.put_item(Item=params)
        user = dynamodb_client.get_item(TableName='UserDetails', Key={'Email':{'S':event['Email']}})
        response = {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'message': 'Shipper permission updated successfully',
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
            'message': 'Error updating shippers permission'
        }
    return response
import json
import boto3

def lambda_handler(event, context):
    # TODO implement
    print(event)
    AddressID = event['address']
    dynamodb = boto3.client('dynamodb')

    # Specify your DynamoDB table name
    table_name = 'UserAddress'

    try:
        # Delete the item from DynamoDB
        response = dynamodb.delete_item(
            TableName=table_name,
            Key={
                'AddressID': {'S': AddressID}  # Assuming 'ID' is the primary key attribute name
            }
        )
        
        address = dynamodb.get_item(
                TableName='UserAddress',  # Replace with your table name
                Key={'AddressID':{'S':response['AddressID']}}
        )

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': 'Address deleted successfully',
            'address': address['Item']
        }

    except Exception as e:
        print(f"Error: {e}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': 'Address deletion failed',
        }
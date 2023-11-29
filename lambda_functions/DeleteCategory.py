import json
import boto3

def lambda_handler(event, context):
    # TODO implement
    CategoryID = event['CategoryID']
    dynamodb = boto3.client('dynamodb')

    # Specify your DynamoDB table name
    table_name = 'ProductCategory'

    try:
        # Delete the item from DynamoDB
        response = dynamodb.delete_item(
            TableName=table_name,
            Key={
                'CategoryID': {'S': CategoryID}  # Assuming 'ID' is the primary key attribute name
            }
        )

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'message': 'Category deleted successfully',
        }

    except Exception as e:
        print(f"Error: {e}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': 'Category deletion failed',
        }
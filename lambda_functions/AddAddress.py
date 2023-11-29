import json
import boto3
import uuid

dynamodb = boto3.resource('dynamodb')
dynamodb_client = boto3.client('dynamodb')
table = dynamodb.Table('UserAddress')

def lambda_handler(event, context):
    print(event)
    try:
        data = event
        data['AddressID'] = str(uuid.uuid4())
        for key, value in data.items():
            if value is None:
                data[key] = ''
        params = {
            'TableName': 'UserAddress',
            'Item': {
                'AddressID': data['AddressID'],
                'Firstname': data['Firstname'],
                'Lastname': data['Lastname'],
                'Address1': data['Address1'],
                'Address2': data['Address2'],
                'Country': data['Country'],
                'City': data['City'],
                'Street': data['Street'],
                'Building': data['Building'],
                'Floor': data['Floor'],
                'Apartment': data['Apartment'],
                'PhoneNumber': data['PhoneNumber'],
                'PostalCode': data['PostalCode'],
                'User': data['User']
                # Add other attributes as needed
            },
        }
        
        table.put_item(Item=params['Item'])

        address = dynamodb_client.get_item(
                TableName='UserAddress',  # Replace with your table name
                Key={'AddressID':{'S':data['AddressID']}}
        )
        response = {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': 'User data added successfully',
            'address': address['Item']
        }
        
    except Exception as e:
        print(f'Error: {e}')
        response = {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': 'Error adding user data'
        }

    return response
import json
import boto3
import uuid

dynamodb_r = boto3.resource('dynamodb')
table = dynamodb_r.Table('Cart')
dynamodb = boto3.client('dynamodb')

def lambda_handler(event, context):
    try:
        response = dynamodb.get_item(TableName='Product', Key={'ProductID':{'S':event['ProductID']}})
        if 'Item' in response:
             
            product = response['Item']

            productdir = {
                'ProductID': product['ProductID']['S'],
                'Name': product["Name"]['S'],
                'Description': product["Description"]['S'],
                'Category': product["Category"]['S'],
                'NumberInStock': product["NumberInStock"]['S'],
                'Price': product["Price"]['S']
            }
            
            cart_response = dynamodb.scan(
                TableName='Cart',
                ExpressionAttributeNames = {'#N': 'User', '#Q': 'OrderState' },
                FilterExpression='#N = :value AND #Q.Pending = :statevalue',  # Replace 'ColumnName' with your actual attribute name
                ExpressionAttributeValues={':value': {'S': event['UserID']}, ':statevalue': {'BOOL': True}}  # Assuming 'S' for string, adjust for other types
            )
            
            print(cart_response)
            if 'Items' in cart_response and len(cart_response['Items']) > 0:
                flag = 0
                for index in range(len(cart_response['Items'])):
                    print(index)
                    if cart_response['Items'][index]['Product']['M']['ProductID']['S'] == event['ProductID'] and cart_response['Items'][index]['OrderQuantity']['S'] == event['OrderQuantity']:
                        totalPrice = 0
                        for i in range(len(cart_response['Items'])):
                            totalPrice += int(cart_response['Items'][i]['TotalPrice']['S'])
                        return {
                            'statusCode': 500,
                            'headers': {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            },
                            'TotalPrice': totalPrice,
                            'cart': cart_response['Items'],
                            'message': 'product already existed'
                        }
                    
                    elif cart_response['Items'][index]['Product']['M']['ProductID']['S'] == event['ProductID'] and cart_response['Items'][index]['OrderQuantity']['S'] != event['OrderQuantity']:

                        TotalPrice = int(cart_response['Items'][index]['TotalPrice']['S']) - event['OrderQuantity']
                        
                        
                        key = cart_response['Items'][index]['CartID']['S']
                        update_response = table.update_item(
                            Key={'CartID': key},
                            UpdateExpression='SET OrderQuantity = :products',
                            ExpressionAttributeValues={':products': event['OrderQuantity']}  # Use the modified product list here
                        )
                        
                        update_response = table.update_item(
                            Key={'CartID': key},
                            UpdateExpression='SET TotalPrice = :price',
                            ExpressionAttributeValues={':price': str(TotalPrice)}  # Use the modified product list here
                        )
                        
                        cart = dynamodb.scan(
                            TableName='Cart',
                            ExpressionAttributeNames = {'#N': 'User', '#Q': 'OrderState' },
                            FilterExpression='#N = :value AND #Q.Pending = :statevalue',  # Replace 'ColumnName' with your actual attribute name
                            ExpressionAttributeValues={':value': {'S': event['UserID']}, ':statevalue': {'BOOL': True}}  # Assuming 'S' for string, adjust for other types
                        )
                        totalPrice = 0
                        for i in range(len(cart['Items'])):
                            totalPrice += int(cart['Items'][i]['TotalPrice']['S'])
                        return {
                            'statusCode': 200,
                            'headers': {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            },
                            'cart': cart['Items'],
                            'TotalPrice': totalPrice,
                            'message': 'cart updated successfully'
                        }
                TotalPrice = int(event['OrderQuantity']) * int(productdir['Price'])
                params = {
                    'CartID': str(uuid.uuid4()),
                    'User': event['UserID'],
                    'Product': productdir,
                    'OrderQuantity': event['OrderQuantity'],
                    'TotalPrice': str(TotalPrice),
                    'OrderState': {
                        'Pending': True,
                        'Shipped': False,
                        'Delivered': False,
                        'Returned': False,
                        'Refunded': False,
                        'Confirmed': False
                    }
                }
                        
                table.put_item(Item=params)
                        
                cart = dynamodb.scan(
                    TableName='Cart',
                    ExpressionAttributeNames = {'#N': 'User', '#Q': 'OrderState' },
                    FilterExpression='#N = :value AND #Q.Pending = :statevalue',  # Replace 'ColumnName' with your actual attribute name
                    ExpressionAttributeValues={':value': {'S': event['UserID']}, ':statevalue': {'BOOL': True}}  # Assuming 'S' for string, adjust for other types
                )
                
                totalPrice = 0
                for i in range(len(cart['Items'])):
                    totalPrice += int(cart['Items'][i]['TotalPrice']['S'])
                    
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'cart': cart['Items'],
                    'TotalPrice': totalPrice,
                    'message': 'cart updated successfully'
                }
                
                
            else:
                TotalPrice = int(event['OrderQuantity']) * int(productdir['Price'])
                params = {
                    'CartID': str(uuid.uuid4()),
                    'User': event['UserID'],
                    'Product': productdir,
                    'OrderQuantity': event['OrderQuantity'],
                    'TotalPrice': str(TotalPrice),
                    'OrderState': {
                        'Pending': True,
                        'Shipped': False,
                        'Delivered': False,
                        'Returned': False,
                        'Refunded': False,
                        'Confirmed': False
                    }
                }
                    
                table.put_item(Item=params)
                    
                cart = dynamodb.scan(
                    TableName='Cart',
                    ExpressionAttributeNames = {'#N': 'User', '#Q': 'OrderState' },
                    FilterExpression='#N = :value AND #Q.Pending = :statevalue',  # Replace 'ColumnName' with your actual attribute name
                    ExpressionAttributeValues={':value': {'S': event['UserID']}, ':statevalue': {'BOOL': True}}  # Assuming 'S' for string, adjust for other types
                )
                
                totalPrice = 0
                for i in range(len(cart['Items'])):
                    totalPrice += int(cart['Items'][i]['TotalPrice']['S'])
                    
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'TotalPrice': totalPrice,
                    'cart': cart['Items'],
                    'message': 'cart updated successfully'
                }
        else:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'message': 'product not existing'
            }
            
    except:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'message': 'Error while searching'
        }
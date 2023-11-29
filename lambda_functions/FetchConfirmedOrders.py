import json
import boto3

dynamodb_r = boto3.resource('dynamodb')
order_table = dynamodb_r.Table('Order')
cart_table = dynamodb_r.Table('Cart')
dynamodb = boto3.client('dynamodb')

def lambda_handler(event, context):
    try:
        cart = dynamodb.scan(
            TableName='Cart',
            ExpressionAttributeNames = {'#Q': 'OrderState' },
            FilterExpression='#Q.Confirmed = :statevalue',  # Replace 'ColumnName' with your actual attribute name
            ExpressionAttributeValues={':statevalue': {'BOOL': True}}  # Assuming 'S' for string, adjust for other types
        )
        # print(cart)
        if 'Items' in cart:
            order_dir = {}
            for index in range(len(cart['Items'])):
                print(cart['Items'][index])
                productdir = {
                    'ProductID': cart['Items'][index]['Product']['M']['ProductID']['S'],
                    'Name': cart['Items'][index]['Product']['M']['Name']['S'],
                    'Description': cart['Items'][index]['Product']['M']['Description']['S'],
                    'Category': cart['Items'][index]['Product']['M']['Category']['S'],
                    'NumberInStock': cart['Items'][index]['Product']['M']['NumberInStock']['S'],
                    'Price': cart['Items'][index]['Product']['M']['Price']['S']
                }
                order = dynamodb.scan(
                    TableName='Order',
                    ExpressionAttributeNames = {'#Q': 'CartID' },
                    FilterExpression='#Q = :statevalue',  # Replace 'ColumnName' with your actual attribute name
                    ExpressionAttributeValues={':statevalue': {'S': cart['Items'][index]['CartID']['S']}}  # Assuming 'S' for string, adjust for other types
                )['Items'][0]
                print(order)
                orderstate = {
                    'Delivered': cart['Items'][index]['OrderState']['M']['Delivered']['BOOL'],
                    'Confirmed': cart['Items'][index]['OrderState']['M']['Confirmed']['BOOL'],
                    'Shipped': cart['Items'][index]['OrderState']['M']['Shipped']['BOOL'],
                    'Returned': cart['Items'][index]['OrderState']['M']['Returned']['BOOL'],
                    'Pending': cart['Items'][index]['OrderState']['M']['Pending']['BOOL'],
                    'Refunded': cart['Items'][index]['OrderState']['M']['Refunded']['BOOL'],
                }
                print(orderstate)
                response = dynamodb.get_item(TableName='UserDetails', Key={'Email':{'S':cart['Items'][index]['User']['S']}})['Item']
                print(response)
                params = {
                    'Product': productdir,
                    'DeliveryDate': order['DeliveryDate']['S'],
                    'ShipDate': order['ShipDate']['S'],
                    'TotalPrice': order['TotalPrice']['S'],
                    'OrderQuantity': cart['Items'][index]['OrderQuantity']['S'],
                    'OrderState': orderstate,
                    'OrderID': order['OrderID']['S'],
                    'CartID': order['CartID']['S'],
                    'OrderDate': order['OrderDate']['S'],
                    'Firstname': response['Firstname']['S'],
                    'Lastname': response['Lastname']['S'],
                    'Email': response['Email']['S']
                    # 'PhoneNumber': response['PhoneNumber']['S'],
                }
                print(params)
                
                order_dir[index] = params
            if len(order_dir) > 0:
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'OrdersToShip': order_dir,
                    'message': 'Order details found'
                }
            else:
                return {
                    'statusCode': 500,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'OrdersToShip': {},
                    'message': 'No order details found'
                }
        else:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'OrdersToShip': {},
                'message': 'No shipped orders found'
            }
    except:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'message': 'Error fetching shipped orders'
        }

import React from 'react';

export const OrderData = (props) => {

    if (props.orderData) {
    return (
        <div>
            <h2>Order Data</h2>
            <div className='order-data-holder'>
                <div className='orded-data-column'>
                    <div className='order-data-row'>Order ID: {props.orderData.orderId}</div>
                    <div className='order-data-row'>Customer ID: {props.orderData.customerId}</div>
                    <div className='order-data-row'>First name: {props.orderData.billing_address.first_name}</div>
                    <div className='order-data-row'>Last name:{props.orderData.billing_address.last_name}</div>
                    <div className='order-data-row'>Status: {props.orderData.status}</div>
                </div>
                <div className='orded-data-column'>
                    <div className='order-data-row'>Country: {props.orderData.billing_address.country}</div>
                    <div className='order-data-row'>Province: {props.orderData.billing_address.province}</div>
                    <div className='order-data-row'>City: {props.orderData.billing_address.city}</div>
                    <div className='order-data-row'>Adress: {props.orderData.billing_address.address1}</div>
                </div>
            </div>
            <div className='lime items-holder'>
                <h3>Line Items</h3>
                {props.orderData.line_items.map((line_item, index) => {
                    return (
                        <div key={index} className='lime-item-row'>
                            <div className='line-item-column'>Name: {line_item.name}</div>
                            {line_item.sku ? <div className='line-item-column'>SKU: {line_item.sku}</div>: null}
                            <div className='line-item-column'>Quantity: {line_item.quantity}</div>
                            <div className='line-item-column'>List price: {line_item.price}</div>
                        </div>
                    )
                })}
            </div>
            <div className='total-row'>
                <h3>Total</h3>
            </div>
            <div className='total-row'>
                Total discounts: {props.orderData.total_discounts}
            </div>           
            <div className='total-row'>
                Total price: {props.orderData.total_price}
            </div>
        </div>
    ) } else {
        return (
            <div>
                There is no order with this ID
            </div>
        )
    }
}

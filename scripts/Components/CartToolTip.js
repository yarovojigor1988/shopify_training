import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CartToolTip.scss';
import { OrderData } from './OrderData';

export const CartToolTip = () => {
    let [order, setOrder] = useState('');
    let [orderExist, setOrderExist] = useState(false);
    let [orderData, setOrderData] = useState({});


    const changeValue = (e) => {

        const valueGoal = (e.target.validity.valid) ? e.target.value : order;
        setOrder(valueGoal);

    }

    const submitValue = () => {
        const orderId = order.toString().trim();
        
        let reversedOrder = window.ordersArray.filter(orderEl => {
            return orderEl.order_number === orderId;
        })

        if (reversedOrder.length > 0) {
            setOrderData(reversedOrder[0]);
            setOrderExist(true);
        } else {
            setOrderExist(true);
            setOrderData(false);
        }
    }
    
    return (
        <div>
            <div className='custom-form-holder'>
                <input className='custom-form-input' value={order} type="text" pattern="[0-9]*" onChange={e => changeValue(e)} placeholder='Order ID'></input>
                <button className='custom-form-submit' type='submit' onClick={submitValue}>Submit</button>
            </div>

            {orderExist ?
                <OrderData orderData = {orderData} /> :
                null
            }

        </div>
    )
}

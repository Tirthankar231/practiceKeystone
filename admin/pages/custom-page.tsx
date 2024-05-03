import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define an interface for the order object
interface Order {
    id: string;
    orderId: string;
    currency: string;
    value: string;
    state: string;
}

export default function CustomPage() {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get<Order[]>('http://localhost:3000/rest/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    return (
        <div>
            <h1>Orders</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Order ID</th>
                        <th>Currency</th>
                        <th>Value</th>
                        <th>State</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.orderId}</td>
                            <td>{order.currency}</td>
                            <td>{order.value}</td>
                            <td>{order.state}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

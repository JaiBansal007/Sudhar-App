"use client"
import { auth } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import {useRouter} from 'next/navigation';
interface Order {
    id: number;
    name: string;
    email: string;
    address: string;
    product: string;
}

export default function Order() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [userID, setUserID] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const router = useRouter();
    useEffect(() => {
        // Fetch orders from an API or use mock data
        const fetchDetails = async () => {
            onAuthStateChanged(auth, async (user) => {
              if (user) {
                setUserID(user.uid);
                setUserEmail(user.email);
              } else {
                router.push("/ngo/signin");
              }
            });
          };
            
        fetchDetails();
    }, []);

    return (
        <div>
            <h1>Order Page</h1>
            <form>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" required />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required />
                </div>
                <div>
                    <label htmlFor="address">Address:</label>
                    <input type="text" id="address" name="address" required />
                </div>
                <div>
                    <label htmlFor="product">Product:</label>
                    <select id="product" name="product" required>
                        <option value="product1">Product 1</option>
                        <option value="product2">Product 2</option>
                        <option value="product3">Product 3</option>
                    </select>
                </div>
                <button type="submit">Place Order</button>
            </form>

            <h2>All Orders</h2>
            <ul>
                {orders.map(order => (
                    <li key={order.id}>
                        <p>Name: {order.name}</p>
                        <p>Email: {order.email}</p>
                        <p>Address: {order.address}</p>
                        <p>Product: {order.product}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

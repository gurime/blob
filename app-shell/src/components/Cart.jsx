import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useState, useEffect } from 'react';
import { db } from '../db/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth } from '../db/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import SecNav from './SecNav';

export default function Cart() {
    return (
        <>
        <Navbar />
        <SecNav />
        <div className="cart-header">
            <h1>Shopping Cart</h1>
            <p>Manage your items below</p>
        </div>
        <div className="cart-container">
        <h1>Your Cart</h1>
        <p>Cart items will be displayed here.</p>
        {/* Add cart items and functionality here */}
        </div>
        <Footer />
        </>
    );
}
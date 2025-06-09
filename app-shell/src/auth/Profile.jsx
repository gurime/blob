import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { db } from '../db/firebase';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    return (
        <>
        <Navbar />
       

        <div className="profile-page">
            <h1>User Profile</h1>
            <p>Profile details will be displayed here.</p>
            {/* Add profile details and edit functionality here */}
        </div> 
        <Footer />
        </>
    );
}
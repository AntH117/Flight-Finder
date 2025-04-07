import React from 'react';
import './Header.css';
import {Link, Navigate } from 'react-router-dom';

export default function Header() {


    return <div className='header-body'>
        <Link to='/home' style={{color: '#333333', textDecoration: 'none'}}><h4>Home</h4></Link>
        <Link to='/find'style={{color: '#333333', textDecoration: 'none'}} ><h4>Find Flights</h4></Link>
    </div>
}
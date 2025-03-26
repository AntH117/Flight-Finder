import React from 'react';
import './Header.css';
import {Link, Navigate } from 'react-router-dom';

export default function Header() {


    return <div className='header-body'>
        <Link to='/home'><h4>Home</h4></Link>
        <Link to='/find'><h4>Find Flights</h4></Link>
    </div>
}
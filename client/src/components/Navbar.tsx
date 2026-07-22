import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../app/store";
import { logout } from "../features/auth/authSlice";
import { act, useState } from "react";
import "../styles/navigation.css"

import logo from '../images/logo.png'
import homeIcon from '../images/home.png'
import newIcon from '../images/plus.png'
import searchIcon from '../images/search.png'
import messageIcon from '../images/message.png'
import activityIcon from '../images/activity.png'
import profileIcon from '../images/user.png'
import savedIcon from '../images/saved.png'

export function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector((state: RootState) => state.auth.user);

    function handleLogout() {
        dispatch(logout());
        navigate('/login');
    }

    return (
        <aside className="sidebar">

            <nav className="sidebarNav">
                <Link to="/" className="appLogo">
                    <img src={logo} alt="Logo" className="navIcon" />
                </Link>

                <Link to="/" className="navItem">
                    <img src={homeIcon} alt="Home" className="navIcon" />
                    <span>Home</span>
                </Link>

                <Link to="/create" className="navItem">
                    <img src={newIcon} alt="New Post" className="navIcon" />
                    <span>New Post</span>
                </Link>

                <Link to="" className="navItem">
                    <img src={searchIcon} alt="Search" className="navIcon" />
                    <span>Search</span>
                </Link>

                <br />

                <Link to="/messages" className="navItem">
                    <img src={messageIcon} alt="Messages" className="navIcon" />
                    <span>Messages</span>
                </Link>

                <Link to="" className="navItem">
                    <img src={activityIcon} alt="Activity" className="navIcon" />
                    <span>Activity</span>
                </Link>

                {currentUser && (
                    <Link to={`/profile/${currentUser._id}`} className="navItem">
                        <img src={profileIcon} alt="Profile" className="navIcon" />
                        <span>Profile</span>
                    </Link>
                )}

                <Link to="/favorites" className="navItem">
                    <img src={savedIcon} alt="Saved" className="navIcon" />
                    <span>Saved</span>
                </Link>

                <br />
                <Link to="" className="navItem">
                    <span>Groups</span>
                </Link>

            </nav>

            <div className="sidebarFooter">
                <button type="button" onClick={handleLogout} className="logoutBtn">
                    Log Out
                </button>
            </div>
        </aside>
    )
}
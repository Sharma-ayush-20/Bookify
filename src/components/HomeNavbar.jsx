import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { useFirebase } from '../context/firebase';
import { useNavigate, Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import '../App.css';

function HomeNavbar() {
    const firebase = useFirebase();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await firebase.logoutUser();
            toast.success("User Logout Successfully!!");
            // Add a small delay before navigation to show the toast
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (error) {
            console.error("Error during logout: ", error);
            toast.error("Error logging out!");
        }
    };

    return (
        <>
            <Navbar
                bg="dark"
                data-bs-theme="dark"
                fixed="top"
                className={`navbar-custom ${scrolled ? 'scrolled' : ''}`}
                expand="lg"
                style={{ marginBottom: '10px' }}
            >
                <Container>
                    <Navbar.Brand as={Link} to="/" className="brand-logo">
                        <span className="logo-text">Bookify</span>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto nav-links">
                            <Nav.Link as={Link} to="/" className="nav-link-item">Home</Nav.Link>
                            {firebase.isLoggedIn ? (
                                <>
                                    <Nav.Link as={Link} to="/book/list" className="nav-link-item">Add Listing</Nav.Link>
                                    <Nav.Link as={Link} to="/book/orders" className="nav-link-item">Orders</Nav.Link>
                                    <Nav.Link as={Link} to={`/user/profile/${firebase.user?.uid}`} className="nav-link-item">Profile</Nav.Link>
                                    <Button 
                                        variant="danger" 
                                        onClick={handleLogout} 
                                        className="logout-btn"
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Nav.Link as={Link} to="/login" className="nav-link-item">Login</Nav.Link>
                                    <Nav.Link as={Link} to="/register" className="nav-link-item">Register</Nav.Link>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            
            <ToastContainer />
        </>
    );
}

export default HomeNavbar;

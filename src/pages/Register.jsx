import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate, Link } from 'react-router-dom';
import { useFirebase } from '../context/firebase.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Register.css';

function Register() {
    const firebase = useFirebase();
    const navigate = useNavigate();
    const [fullname, setFullName] = useState('');
    const [username, setUserName] = useState('');
    const [age, setAge] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            await firebase.signUpWithEmailAndPassword(
                fullname,
                username,
                age,
                email,
                password,
                profileImage
            );
            
            toast.success('User registered successfully!');
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (e) {
            console.error('Error signing up: ', e);
            toast.error(`Registration failed: ${e.message || 'Unknown error'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (firebase.isLoggedIn) {
            navigate('/');
        }
    }, [firebase.isLoggedIn, navigate]);

    return (
        <>
            <div className="register-container">
                <div className="register-card">
                    <h2 className="register-title">Create Account</h2>
                    <Form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-column">
                                <Form.Group controlId="formFullName">
                                    <Form.Label>Full Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter full name"
                                        value={fullname}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </div>
                            <div className="form-column">
                                <Form.Group controlId="formUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter username"
                                        value={username}
                                        onChange={(e) => setUserName(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </div>
                            <div className="form-column">
                                <Form.Group controlId="formAge">
                                    <Form.Label>Age</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter age"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-column">
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </div>
                            <div className="form-column">
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-column">
                                <Form.Group controlId="formProfileImage">
                                    <Form.Label>Profile Image</Form.Label>
                                    <Form.Control
                                        type="file"
                                        onChange={(e) => setProfileImage(e.target.files[0])}
                                    />
                                </Form.Group>
                            </div>
                        </div>
                        <Button 
                            variant="primary" 
                            type="submit" 
                            className="register-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Registering...' : 'Register'}
                        </Button>
                    </Form>
                    <div className="register-footer">
                        Already have an account? <Link to="/login" className="register-link">Login here</Link>
                    </div>
                </div>
            </div>
            
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </>
    );
}

export default Register;

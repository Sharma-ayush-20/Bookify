import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFirebase } from '../context/firebase';

function Login() {
    const firebase = useFirebase()
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    //function to login user
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            await firebase.signInUser(email, password);
            toast.success("User Login Successfully!");
            console.log("User Login Successfully");
            
            // Delay navigation to allow toast to be visible
            setTimeout(() => {
                navigate("/");
            }, 2000); // 2 seconds delay
            
        } catch (e) {
            console.log("Error Occurred at Login", e);
            toast.error("Error during login. Please try again.");
            setIsLoading(false);
        }
    };

    //function handleGoogle
    const handleGoogle = async () => {
        setIsLoading(true);
        
        try {
            await firebase.signInWithGoogle();
            toast.success("User Login With Google Successfully!");
            
            // Delay navigation to allow toast to be visible
            setTimeout(() => {
                navigate("/");
            }, 2000); // 2 seconds delay
            
        } catch (e) {
            console.log("Error Occurred at login with Google", e);
            toast.error("Error during Google login. Please try again.");
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (firebase.isLoggedIn) {
            navigate("/")
        }
    }, [firebase.isLoggedIn, navigate])

    return (
        <div className="container mt-5 d-flex flex-column align-items-center">
            <div className="card p-4 shadow mt-5" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="text-center mb-4">Login</h2>
                <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control-lg"
                            disabled={isLoading}
                        />
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control-lg"
                            disabled={isLoading}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Remember me" disabled={isLoading} />
                    </Form.Group>
                    <Button
                        variant="primary"
                        type="submit"
                        className="w-100 py-2 mb-3"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                </Form>
                <div className="d-flex align-items-center my-3">
                    <hr className="flex-grow-1" />
                    <span className="px-2 text-muted">OR</span>
                    <hr className="flex-grow-1" />
                </div>
                <Button
                    variant="danger"
                    onClick={handleGoogle}
                    className="w-100 py-2"
                    disabled={isLoading}
                >
                    {isLoading ? 'Connecting...' : 'Sign in With Google'}
                </Button>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    )
}

export default Login

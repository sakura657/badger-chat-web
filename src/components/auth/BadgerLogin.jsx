import React, { useRef, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

export default function BadgerLogin() {

    const usernameRef = useRef(null);
    const pinRef = useRef(null);

    const sevenDigitRegex = /^\d{7}$/;

    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);
    const navigate = useNavigate();

    function handleLoginSubmit(e) {
        e.preventDefault();

        const username = usernameRef.current.value;
        const pin = pinRef.current.value;

        // 1. Check if username or pin is empty
        if (!username || !pin) {
            alert("You must provide both a username and pin!");
            return;
        }

        // 2. Check if pin is 7 digits
        if (!sevenDigitRegex.test(pin)) {
            alert("Your pin is a 7-digit number!");
            return;
        }

        fetch("https://cs571api.cs.wisc.edu/rest/s25/hw6/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                pin: pin
            })
        })
        .then(res => {
            if (res.status === 200) {
                alert("Login successful!");
                setLoginStatus(username);
                navigate("/");
            } else {
                // If the username or pin is incorrect
                alert("Incorrect username or pin!");
            }
        })
        .catch(err => {
            console.error("Error:", err);
            alert("An unexpected error occurred.");
        });
    }

    return (
        <>
            <h1>Login</h1>
            {/* Using React-Bootstrap Form for styling. */}
            <Form onSubmit={handleLoginSubmit} style={{ maxWidth: "600px" }}>
                <Form.Group className="mb-3" controlId="usernameInput">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your username"
                        ref={usernameRef}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="pinInput">
                    <Form.Label>Password (7-digit PIN)</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter your 7-digit PIN"
                        ref={pinRef}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Login
                </Button>
            </Form>
        </>
    );
}
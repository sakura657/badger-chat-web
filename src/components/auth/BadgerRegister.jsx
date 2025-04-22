import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

export default function BadgerRegister() {
    const [username, setUsername] = useState("");
    const [pin, setPin] = useState("");
    const [pinRepeat, setPinRepeat] = useState("");

    const sevenDigitRegex = /^\d{7}$/;

    function handleRegisterSubmit(e) {
        e.preventDefault();

        // 1. Check if username or pin is empty
        if (!username || !pin) {
            alert("You must provide both a username and pin!");
            return;
        }

        // 2. Check if pin is 7 digits
        if (!sevenDigitRegex.test(pin)) {
            alert("Your pin must be a 7-digit number!");
            return;
        }

        // 3. Check if pins match
        if (pin !== pinRepeat) {
            alert("Your pins do not match!");
            return;
        }

        fetch("https://cs571api.cs.wisc.edu/rest/s25/hw6/register", {
            method: "POST",
            credentials: "include",
            headers: {
                "X-CS571-ID": "bid_bcbfe941f59a51e050d18b92d6f5efe7972acdc3b1d49ff70a08881d5cccb254",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                pin: pin
            })
        })
        .then(res => {
            if (res.status === 200) {
                // Registration successful
                alert("Registration successful!");
            } else if (res.status === 409) {
                // Username already taken
                alert("That username has already been taken!");
            } else {
                // Some other error, optional to handle
                alert("An error occurred while registering!");
            }
        })
        .catch(err => {
            // Network error or unexpected error
            console.error("Error:", err);
            alert("An unexpected error occurred.");
        });
    }

    return (
        <>
            <h1>Register</h1>
            
            <Form onSubmit={handleRegisterSubmit} style={{ maxWidth: "600px" }}>
                <Form.Group className="mb-3" controlId="usernameInput">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="pinInput">
                    <Form.Label>Password (7-digit PIN)</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter your 7-digit PIN"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="pinRepeatInput">
                    <Form.Label>Repeat Password (7-digit PIN)</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Repeat your 7-digit PIN"
                        value={pinRepeat}
                        onChange={(e) => setPinRepeat(e.target.value)}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Register
                </Button>
            </Form>
        </>
    )
}
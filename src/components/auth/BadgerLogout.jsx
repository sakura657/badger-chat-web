import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

export default function BadgerLogout() {

    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('https://cs571api.cs.wisc.edu/rest/s25/hw6/logout', {
            method: 'POST',
            headers: {
                "X-CS571-ID": "bid_bcbfe941f59a51e050d18b92d6f5efe7972acdc3b1d49ff70a08881d5cccb254"
            },
            credentials: "include"
        }).then(res => res.json()).then(json => {
            // Maybe you need to do something here?
            alert("You have been logged out!");
            setLoginStatus(undefined);
            navigate("/");
        })
    }, []);

    return <>
        <h1>Logout</h1>
        <p>You have been successfully logged out.</p>
    </>
}

import React, { useEffect, useState, useContext, useRef } from "react"
import { Row, Col, Pagination, Form, Button } from "react-bootstrap"
import BadgerMessage from "./BadgerMessage"
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext"

export default function BadgerChatroom(props) {

    const [messages, setMessages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const [loginStatus] = useContext(BadgerLoginStatusContext);
    const titleRef = useRef(null);
    const contentRef = useRef(null);

    const loadMessages = () => {
        fetch(`https://cs571api.cs.wisc.edu/rest/s25/hw6/messages?chatroom=${props.name}&page=${currentPage}`, {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        }).then(res => res.json()).then(json => {
            setMessages(json.messages)
        })
    };

    function handleCreatePost(e) {
        e.preventDefault();

        // Get the current values from refs
        const titleValue = titleRef.current.value;
        const contentValue = contentRef.current.value;

        // Validate input
        if (!titleValue || !contentValue) {
            alert("You must provide both a title and content!");
            return;
        }

        // Make a POST request to create a new message
        fetch(`https://cs571api.cs.wisc.edu/rest/s25/hw6/messages?chatroom=${props.name}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: titleValue,
                content: contentValue
            })
        })
        .then(res => {
            if (res.status === 200) {
                alert("Successfully posted!");
                // Clear the inputs
                titleRef.current.value = "";
                contentRef.current.value = "";
                // Reload messages
                loadMessages();
            } else {
                alert("An error occurred while posting!");
            }
        })
        .catch(err => {
            console.error("Error creating post:", err);
            alert("An unexpected error occurred.");
        });
    }

    function handleDeletePost(msgId) {
        fetch(`https://cs571api.cs.wisc.edu/rest/s25/hw6/messages?id=${msgId}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        })
        .then(res => {
            if (res.status === 200) {
                alert("Successfully deleted the post!");
                loadMessages();
            } else {
                alert("An error occurred while deleting the post!");
            }
        })
        .catch(err => {
            console.error("Error deleting post:", err);
            alert("An unexpected error occurred.");
        });
    }

    // Why can't we just say []?
    // The BadgerChatroom doesn't unload/reload when switching
    // chatrooms, only its props change! Try it yourself.
    useEffect(loadMessages, [props, currentPage]);

    return <>
        <h1>{props.name} Chatroom</h1>
        {
            /* TODO: Allow an authenticated user to create a post. */
            !loginStatus ? (
                <p>You must be logged in to post!</p>
            ) : (
                <Form onSubmit={handleCreatePost} style={{ maxWidth: "600px", marginBottom: "1rem" }}>
                    <Form.Group className="mb-3" controlId="postTitle">
                        <Form.Label>Post Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter post title"
                            ref={titleRef} // Uncontrolled
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="postContent">
                        <Form.Label>Post Content</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter post content"
                            ref={contentRef} // Uncontrolled
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Create Post
                    </Button>
                </Form>
            )
        }
        <hr/>
        {
            messages.length > 0 ?
                <>
                    {
                        <Row>
                            {
                                messages.map(msg => (
                                    <Col 
                                        key={msg.id} 
                                        xs={12} 
                                        sm={6} 
                                        md={4} 
                                        lg={3} 
                                        style={{ marginBottom: "1rem" }}
                                    >
                                        <BadgerMessage
                                            id={msg.id}
                                            title={msg.title}
                                            poster={msg.poster}
                                            content={msg.content}
                                            created={msg.created}

                                            // If the user is logged in and the username matches msg.poster,
                                            // then they own the post.
                                            userIsOwner={loginStatus && loginStatus === msg.poster}
                                            onDelete={() => handleDeletePost(msg.id)}
                                        />
                                    </Col>
                                ))
                            }
                        </Row>
                    }
                </>
                :
                <>
                    <p>There are no messages on this page yet!</p>
                </>
        }

        <hr />
        {/*
            Hardcode 4 Pagination.Items for pages 1-4.
            The "active" prop will highlight the current page in blue.
        */}
        <Pagination>
            <Pagination.Item 
                active={currentPage === 1} 
                onClick={() => setCurrentPage(1)}
            >
                1
            </Pagination.Item>
            <Pagination.Item 
                active={currentPage === 2} 
                onClick={() => setCurrentPage(2)}
            >
                2
            </Pagination.Item>
            <Pagination.Item 
                active={currentPage === 3} 
                onClick={() => setCurrentPage(3)}
            >
                3
            </Pagination.Item>
            <Pagination.Item 
                active={currentPage === 4} 
                onClick={() => setCurrentPage(4)}
            >
                4
            </Pagination.Item>
        </Pagination>
    </>
}

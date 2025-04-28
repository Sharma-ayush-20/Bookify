import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useFirebase } from '../context/firebase.jsx'

function List() {

    const firebase = useFirebase();
    // console.log(firebase)

    const [name, setName] = useState("")
    const [isbnNumber, setIsbnNumber] = useState("")
    const [price, setPrice] = useState("")
    const [coverPic, setCoverPic] = useState("")

    async function handleList(e) {
        e.preventDefault();
        try {
            if (!name || !isbnNumber || !price || !coverPic) {
                throw new Error("All fields are required");
            }
            await firebase.handleCreateNewListing(name, isbnNumber, price, coverPic);
            console.log("Listing SuccessFull")

            // Show success toast after successful listing
            toast.success("List Created Successfully!");

            //reset all of them
            setName("")
            setIsbnNumber("")
            setPrice("")
            setCoverPic("")
        }
        catch (err) {
            console.log("Error occured at Listing ", err)
            toast.error(err.message || "Something went wrong!");
        }
    }

    return (
        <div className="container list-container mt-5" >
            <Form onSubmit={handleList} style={{marginTop: '20px'}}>
                <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label>Enter Book Name</Form.Label>
                    <Form.Control type="text" placeholder="enter book name" value={name}
                        onChange={(e) => setName(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicIsbnno">
                    <Form.Label>Enter Isbn no.</Form.Label>
                    <Form.Control type="number" placeholder="enter isbn no."
                        value={isbnNumber} onChange={(e) => setIsbnNumber(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPrice">
                    <Form.Label>Enter price</Form.Label>
                    <Form.Control type="number" placeholder="enter book price"
                        value={price} onChange={(e) => setPrice(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicImage">
                    <Form.Label>Upload Cover Pic</Form.Label>
                    <Form.Control
                        type="file"
                        onChange={(e) => setCoverPic(e.target.files[0])}
                    />
                </Form.Group>

                <Button
                    variant="danger"
                    type="submit" >
                    Submit
                </Button>
            </Form>

            <ToastContainer />

        </div>
    )
}

export default List
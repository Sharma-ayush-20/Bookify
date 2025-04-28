import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useFirebase } from '../context/firebase'
import '../App.css'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Details() {
  const { id } = useParams();
  const firebase = useFirebase();
  console.log(firebase)
  const [book, setBook] = useState(null)
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    try {
      firebase.showEachBookDetail(id)
        .then((data) => setBook(data))
    }
    catch (err) {
      console.log("Data not fetch in details.jsx")
    }
  }, [id])

  if (!book) return <div className="text-center py-5">Loading...</div>;

  const handleOrder = async () => {
    try {
      await firebase.placeOrder(id, book.coverPicUrl, quantity)
      toast.success(`Order for ${quantity} item(s) placed successfully!`);
    }
    catch (error) {
      console.log("Error Occurred during handle order at detail.jsx", error);
      toast.error('Failed to place order. Try again!');
    }
  }

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  }

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  }

  return (
    <>
    <div className="details-container">
      <div className="details-card">
        <div className="details-image">
          <img src={book.coverPicUrl} alt={book.name} />
        </div>
        <div className="details-content">
          <h1 className="details-title">{book.name}</h1>
          <p className="details-isbn">ISBN: {book.isbnNumber}</p>
          <p className="details-price">₹{book.price}</p>
          <p className="details-uploaded-by">Uploaded By: <span>{book.userEmail}</span></p>
          <p className="details-uploaded-at">
            <strong>Uploaded At:</strong> {new Date(book.createdAt.seconds * 1000).toLocaleString()}
          </p>

          
          <div className="quantity-container">
            <label htmlFor="quantity" className="quantity-label">Quantity:</label>
            <div className="quantity-controls">
              <button 
                className="quantity-btn" 
                onClick={decrementQuantity}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="quantity-input"
              />
              <button 
                className="quantity-btn" 
                onClick={incrementQuantity}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
          
          <button className="details-button" onClick={handleOrder}>Buy Now</button>
        </div>
      </div>
    </div>
        
    <ToastContainer 
      position="top-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
    />
    </>
  )
}

export default Details

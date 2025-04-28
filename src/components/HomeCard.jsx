import React from 'react'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom'

function HomeCard({ price, ISBN, image, name, bookId }) {

  const navigate = useNavigate();

  return (
    <div className="col-md-4 col-lg-3 mb-4">
      <Card className="book-card">
        {image && <Card.Img variant="top" src={image} />}
        <Card.Body>
          <Card.Title className="mb-2">{name}</Card.Title>
          <Card.Text className="mb-3">
            <span className="d-block mb-1">ISBN: {ISBN}</span>
            <span className="price-tag">₹{price}</span>
          </Card.Text>
          <Button className="view-details-btn" onClick={(e) => navigate(`/book/view/${bookId}`)} >View Details</Button>
        </Card.Body>
      </Card>
    </div>
  )
}

export default HomeCard

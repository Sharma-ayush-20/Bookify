import React, { useEffect, useState } from 'react';
import { useFirebase } from '../context/firebase.jsx';
import HomeCard from '../components/HomeCard.jsx';
import { Form, InputGroup, Button, Container, Row, Col } from 'react-bootstrap';
import { FaSearch, FaTimes } from 'react-icons/fa';

function Home() {
  const firebase = useFirebase();
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    firebase.readData()
      .then(data => {
        setBooks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching books:", err);
        setLoading(false);
      });
  }, [firebase]);

  const clearSearch = () => setSearchTerm('');

  const filteredBooks = books.filter(book =>
    book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbnNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showBooks = searchTerm ? filteredBooks : books;

  return (
    <Container className="py-4 mt-5">
      {/* Search Bar */}
      <Row className="mb-3">
        <Col md={8} lg={6} className="mx-auto">
          <InputGroup>
            <Form.Control
              placeholder="Search by book name or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="shadow-sm"
            />
            <Button variant={searchTerm ? "danger" : "primary"} onClick={searchTerm ? clearSearch : null}>
              {searchTerm ? <FaTimes /> : <FaSearch />}
            </Button>
          </InputGroup>
        </Col>
      </Row>

      {/* Heading  */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="books-heading m-0">All Books</h2>    
      </div>

      {loading ? (

        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2">Loading books...</p>
        </div>

      ) 
      : showBooks.length === 0 ? (
        <div className="text-center py-5">
          <FaSearch size={40} className="text-muted mb-3" />
          <h4>No books found</h4>
          <p className="text-muted">We couldn't find any books matching "{searchTerm}"</p>
          <Button variant="outline-primary" onClick={clearSearch}>Clear Search</Button>
        </div>
      ) 
      : (
        <Row>
          {showBooks.map((book) => (
            <HomeCard
              key={book.id}
              price={book.price}
              ISBN={book.isbnNumber}
              image={book.coverPicUrl}
              name={book.name}
              bookId={book.id}
            />
          ))}
        </Row>
      )}
    </Container>
  );
}

export default Home;    
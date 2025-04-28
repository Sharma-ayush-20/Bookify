import React from 'react';
import { Card, Container, Row, Col, Badge } from 'react-bootstrap';
import { useFirebase } from '../context/firebase';
import moment from 'moment';

function Orders() {
  const firebase = useFirebase();
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadOrders = async () => {
      if (firebase.isLoggedIn) {
        try {
          const myOrders = await firebase.fetchMyOrders();
          setOrders(myOrders);
        } catch (error) {
          console.error("Error loading orders:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadOrders();
  }, [firebase.isLoggedIn, firebase]);

  if (!firebase.isLoggedIn) {
    return (
      <div className="auth-required">
        <i className="bi bi-lock"></i>
        <h2>Please log in to view your orders</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="orders-page mt-5">
      <Container>
        <div className="page-header">
          <h1>Your Orders</h1>
          <p className="order-count">{orders.length} {orders.length === 1 ? 'order' : 'orders'} placed</p>
        </div>

        {orders.length > 0 ? (
          <Row className="g-4">
            {orders.map(order => (
              <Col key={order.id} xs={12}>
                <Card className="order-card">
                  <Row className="g-0">
                    <Col md={3} className="order-image-col">
                      <div className="order-image-container">
                        {order.bookDetails?.coverPicUrl ? (
                          <img src={order.bookDetails.coverPicUrl} alt={order.bookDetails.name} />
                        ) : (
                          <div className="no-image">No Image</div>
                        )}
                      </div>
                    </Col>
                    <Col md={9}>
                      <Card.Body>
                        <div className="order-header">
                          <h3>{order.bookDetails?.name || "Unknown Book"}</h3>
                          <Badge bg={order.status === 'delivered' ? 'success' : 'warning'}>
                            {order.status || 'processing'}
                          </Badge>
                        </div>
                        
                        <div className="order-meta">
                          <span className="order-date">
                            Ordered on {moment.unix(order.createdAt?.seconds).format('MMMM D, YYYY')}
                          </span>
                          <span className="order-id">Order #{order.id.substring(0, 8)}</span>
                        </div>
                        
                        <div className="order-details-grid">
                          <div className="detail-item">
                            <span className="detail-label">ISBN:</span>
                            <span>{order.bookDetails?.isbnNumber || "N/A"}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Quantity:</span>
                            <span>{order.quantity || 1}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Price:</span>
                            <span>₹{order.bookDetails?.price || "N/A"}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Total:</span>
                            <span className="price-total">
                              ₹{(order.quantity || 1) * (order.bookDetails?.price || 0)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="order-actions">
                          <button className="btn btn-outline-primary btn-sm">Track Order</button>
                          <button className="btn btn-outline-secondary btn-sm">View Details</button>
                        </div>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <div className="no-orders">
            <div className="no-orders-icon">
              <i className="bi bi-box-seam"></i>
            </div>
            <h3>No orders yet</h3>
            <p>When you place orders, they'll appear here</p>
            <button className="btn btn-primary">Browse Books</button>
          </div>
        )}
      </Container>
    </div>
  );
}

export default Orders;
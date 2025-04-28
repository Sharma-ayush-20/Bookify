import React, { useEffect, useState } from 'react';
import { useFirebase } from '../context/firebase';
import { useParams } from 'react-router-dom';
import { Card, Spinner, Badge, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

function UserProfile() {
  const firebase = useFirebase();
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await firebase.UserData(userId);
        setUser(userData);
        // Check if viewing own profile
        setIsCurrentUser(firebase?.user?.uid === userData.uid);
        // console.log("User Data Fetch Successfully");
      } catch (err) {
        setUser(null);
        // console.log("User data not fetched ", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [firebase, userId]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
        <Card className="text-center shadow border-0" style={{ maxWidth: "400px", width: "100%" }}>
          <Card.Body>
            <h2 className="text-muted">User not found</h2>
            <p>The profile you're looking for doesn't exist or has been removed.</p>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  // Format timestamp to readable date
  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return 'N/A';
    
    try {
      const date = timestamp.toDate();
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      return 'Invalid date';
    }
  };

  const createdAtDate = formatDate(user.createdAt);

  return (
    <Container className="py-5 mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg border-0 overflow-hidden">
            <div 
              className="bg-primary text-white p-4 text-center" 
              style={{ 
                background: "linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)"
              }}
            >
              {user.profilePicUrl ? (
                <img
                  src={user.profilePicUrl}
                  alt="Profile"
                  className="rounded-circle mb-3"
                  style={{ 
                    width: "150px", 
                    height: "150px", 
                    objectFit: "cover", 
                    border: "4px solid white",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    margin: "0 auto 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "48px",
                    color: "#fff",
                    border: "4px solid white",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                  }}
                >
                  {user.fullName?.charAt(0) || user.username?.charAt(0) || "?"}
                </div>
              )}
              <h2 className="mb-1 fw-bold">{user.fullName}</h2>
              <Badge bg="light" text="primary" pill className="px-3 py-2 mb-2">@{user.username}</Badge>
              {isCurrentUser && (
                <div className="mt-2">
                  <Badge bg="light" text="dark" pill className="px-3 py-2">
                    This is your profile
                  </Badge>
                </div>
              )}
            </div>
            
            <Card.Body className="p-4">
              <div className="user-details">
                <div className="detail-item d-flex align-items-center mb-3 pb-3 border-bottom">
                  <div className="detail-icon me-3">
                    <i className="bi bi-envelope-fill text-primary fs-4"></i>
                  </div>
                  <div className="detail-content">
                    <div className="detail-label text-muted small">Email Address</div>
                    <div className="detail-value">{user.email}</div>
                  </div>
                </div>
                
                <div className="detail-item d-flex align-items-center mb-3 pb-3 border-bottom">
                  <div className="detail-icon me-3">
                    <i className="bi bi-calendar-fill text-primary fs-4"></i>
                  </div>
                  <div className="detail-content">
                    <div className="detail-label text-muted small">Age</div>
                    <div className="detail-value">{user.age} years</div>
                  </div>
                </div>
                
                <div className="detail-item d-flex align-items-center mb-3 pb-3 border-bottom">
                  <div className="detail-icon me-3">
                    <i className="bi bi-clock-fill text-primary fs-4"></i>
                  </div>
                  <div className="detail-content">
                    <div className="detail-label text-muted small">Member Since</div>
                    <div className="detail-value">{createdAtDate}</div>
                  </div>
                </div>
                
                <div className="detail-item d-flex align-items-center">
                  <div className="detail-icon me-3">
                    <i className="bi bi-fingerprint text-primary fs-4"></i>
                  </div>
                  <div className="detail-content">
                    <div className="detail-label text-muted small">User ID</div>
                    <div className="detail-value" style={{ wordBreak: 'break-word', fontSize: '0.9rem' }}>
                      {user.uid}
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default UserProfile;

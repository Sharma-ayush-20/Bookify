
# Bookify - Online Book Marketplace

📌 **Description**  
Bookify is a full-stack online book marketplace built with React, Firebase, and Bootstrap, where users can:

- Browse available books
- List books for sale
- Purchase books
- Manage their profile

This project demonstrates user authentication, real-time database interactions, image uploads, and order management using Firebase (Authentication & Firestore) and Cloudinary (for image storage).

✨ **Key Features**  
✅ **User Authentication** – Sign up, login, and logout with email/password or Google  
✅ **Book Listings** – View all available books with search functionality  
✅ **Book Details** – See detailed information about each book  
✅ **Order System** – Place orders with quantity selection  
✅ **User Profiles** – View and manage user details  
✅ **Responsive Design** – Works on mobile, tablet, and desktop  
✅ **Modern UI** – Clean, animated interface with smooth transitions  

🛠️ **Technologies Used**  

**Frontend**:  React, React Router, React Bootstrap
**Backend**:  Firebase (Authentication, Firestore)
**Styling**:  CSS, Bootstrap, Custom Animations
**Image Storage**:  Cloudinary
**State Management**:  React Context API
**Other Libraries**:  react-toastify, react-icons, axios

🚀 **Getting Started**

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Cloudinary account (for image uploads)

### Installation
1. Clone the repository

    ```bash
    git clone https://github.com/your-username/bookify.git
    cd bookify
    ```

2. Install dependencies

    ```bash
    npm install
    ```

3. Set up environment variables  
Create a `.env` file in the root directory with:

    ```env
    REACT_APP_FIREBASE_API_KEY=your-api-key
    REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
    REACT_APP_FIREBASE_PROJECT_ID=your-project-id
    REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
    REACT_APP_FIREBASE_APP_ID=your-app-id
    REACT_APP_CLOUDINARY_CLOUD_NAME=your-cloud-name
    REACT_APP_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
    ```

4. Start the development server

    ```bash
    npm start
    ```

📂 **Project Structure**  

```bash
bookify/
├── public/                  # Static files
├── src/
│   ├── components/          # Reusable components (HomeCard, Navbar, etc.)
│   ├── context/             # Firebase context provider
│   ├── pages/               # Page components (Home, Login, Register, etc.)
│   ├── App.js               # Main app router
│   └── index.js             # App entry point
├── .env                     # Environment variables
├── .gitignore
├── package.json
└── README.md
```

🔮 **Future Enhancements**  
🔹 **Rating System** – Allow users to rate books and sellers  
🔹 **Shopping Cart** – Implement a cart for multiple purchases  
🔹 **Payment Integration** – Add Stripe/PayPal for real transactions  
🔹 **Chat System** – Enable buyer-seller communication  
🔹 **Admin Dashboard** – Manage users and listings  
🔹 **Advanced Search** – Filter by price, category, etc.  
🔹 **Wishlist** – Save books for later  


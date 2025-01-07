# **Products Inventory Application**

A user-friendly inventory management system that allows users to efficiently manage their products with features like adding, editing, and deleting products, viewing details, and generating insightful charts.

## **Features**
- **User Authentication**:
  - Secure login and registration using Firebase Authentication.
- **Inventory Management**:
  - Add, edit, and delete products.
  - View product details.
- **Data Visualization**:
  - Analyze product views and sales trends with dynamic charts using Chart.js.
- **Responsive Design**:
  - Fully optimized for mobile, tablet, and desktop devices.
- **Role-Based Access**:
  - Private routes ensure only authenticated users can access sensitive pages.

---

## **Getting Started**

### **Prerequisites**
- **Node.js** (>=16.x)
- **npm** (>=7.x)
- A Firebase project with Firestore and Authentication enabled.

---

### **Installation**
1. Clone the repository:
   ```bash
   git clone https://github.com/ChethanKacham/ProductsInventory.git
   cd ProductsInventory

2. Install dependencies:
   ```bash
   npm install

3. Configure Firebase:
   - Replace the firebaseConfig object in firebaseConfig.js with your Firebase project details:
   ```bash
   const firebaseConfig = {
   apiKey: "your-api-key",
   authDomain: "your-auth-domain",
   projectId: "your-project-id",
   storageBucket: "your-storage-bucket",
   messagingSenderId: "your-messaging-sender-id",
   appId: "your-app-id"
   };

4. Start the development server:
   ```bash
   npm start

---

## Features by Component

### Authentication
  - **LoginPage.js**:
    - Allows users to log in using Firebase Authentication.
  - **RegistrationPage.js**:
    - Handles user registration with validation.

### Inventory Management
  - **InventoryManagement.js**:
    - Add, edit, delete, and view products.
    - Displays products in a responsive table with modals for product management.

### User Profile
  - **UserDetails.js**:
    - Displays the logged-in user’s details.

### Charts
  - **ChartComp.js**:
    - Visualizes product views and sales trends.

### Static Pages
  - **AboutPage.js**:
    - Describes the purpose and features of the application.

---

## Built With
  - **React.js**: Frontend library for building UI components.
  - **Firebase**:
    - **Firestore**: For storing product and user data.
    - **Authentication**: For secure login and registration.
  - **Chart.js**: For visualizing product analytics.
  - **React Testing Library**: For writing unit tests.
  - **CSS**: For responsive design and styling.

---

## Available Scripts

1. **Start the development server**:
   ```bash
   npm start

2. **Run tests**:
   ```bash
   npm test

3. **Build for production**:
   ```bash
   npm run build

4. **Eject the configuration**:
   ```bash
   npm run eject

---

## Testing

This project includes unit tests written using **React Testing Library** and **Jest**.

### Included Test Suites
1. **AboutPage.test.js**:
   - Tests rendering and content of the About page.
2. **InventoryManagement.test.js**:
   - Covers adding, editing, and deleting products.
3. **LoginPage.test.js**:
   - Validates login functionality and error handling.
4. **RegistrationPage.test.js**:
   - Tests registration form validation and user creation.
5. **App.test.js**:
   - Snapshot testing and route verification.
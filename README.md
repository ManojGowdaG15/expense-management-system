Here’s a **professional, complete, and impressive README.md** file for your GitHub repository. It covers everything required by your assignment, looks clean, and will make a great impression.

Copy-paste this directly into your `README.md` file in the root of your project (`expense-management-system/`).

```markdown
# Expense Management System

A modern, responsive web application for managing employee expense claims with role-based access (Employee & Manager).

Built as part of the Web Developer Position technical assignment for DataSturdy Consulting Private Limited.

**Live Demo**: [Insert your deployed frontend URL here after deployment]  
**Backend API**: [Insert your Render backend URL here]

## Features

### Employee Features
- Submit new expense claims (amount, category, date, description, receipt details)
- View personal expense history with status tracking (Pending, Approved, Rejected)
- Dashboard with summary: Total Submitted, Approved Amount, Pending Claims, Total Expenses
- Refresh data and see last updated timestamp

### Manager Features
- View all expense claims across the team
- Approve or reject claims with optional comments
- Dashboard summary: Pending Approvals, Total Pending Amount, Total Claims
- Real-time refresh functionality

### Common Features
- Secure login with role-based access control
- Mobile-responsive design
- Clean, professional UI with modern styling and icons
- JWT-based authentication with httpOnly cookies

## Technology Stack

### Backend
- **Node.js** + **Express.js**
- **MongoDB** (Atlas) with Mongoose ODM
- **JWT** authentication with httpOnly cookies
- **bcryptjs** for password hashing
- Modular structure with controllers, routes, models, middleware

### Frontend
- **React.js** (Vite)
- **Axios** for API calls
- Plain **HTML/CSS/JavaScript** (no frameworks like Tailwind)
- Professional Heroicons (SVG inline)
- Responsive design with mobile-first approach

### Deployment
- Backend: Render.com
- Frontend: Vercel / Netlify

## Screenshots

*(Add screenshots here after deployment or local run)*
- Login Page
- Employee Dashboard
- Submit Expense Form
- Expense History Table
- Manager Approval Center

## Test Credentials

**Manager Account**
- Email: `manager@example.com`
- Password: `mgr123`

**Employee Accounts**
- Email: `emp1@example.com` to `emp6@example.com`
- Password: `emp123` (for all)

> Sample data is pre-seeded including Pending, Approved, and Rejected expenses for demonstration.

## Setup & Running Locally

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Git

### Steps

1. Clone the repository
```bash
git clone https://github.com/your-username/expense-management-system.git
cd expense-management-system
```

2. Setup Backend
```bash
cd backend
npm install
```

Create `.env` file in `backend/`:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_strong_secret_key_here
NODE_ENV=development
```

Run seeding script to create test users and sample data:
```bash
npm run seed
```

Start backend server:
```bash
npm run dev
```
API will run on `http://localhost:5000`

3. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```
Frontend will run on `http://localhost:5173`

4. Open browser and go to `http://localhost:5173`

## Deployment

### Backend (Render.com)
1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo → Select the `backend` folder
4. Settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables (MONGODB_URI, JWT_SECRET, NODE_ENV=production)

### Frontend (Vercel)
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo → Select the `frontend` folder
3. In Settings → Environment Variables:
   - Add `VITE_API_URL=https://your-render-backend-url.onrender.com/api`
4. Deploy

Update CORS in `backend/server.js` for production:
```js
app.use(cors({
  origin: 'https://your-vercel-frontend-url.vercel.app',
  credentials: true
}));
```

## Project Structure

```
expense-management-system/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── seed.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── public/
├── README.md
└── DECISIONS.md
```

## Known Limitations (as per assignment guidelines)
- No user registration (hardcoded/seeded users)
- No password reset
- No email notifications
- No file upload for receipts (text details only)
- No advanced reporting or analytics

## Future Improvements (with more time)
- Add receipt image upload (Cloudinary/MongoDB GridFS)
- Expense categories management
- Export reports to PDF/Excel
- Notifications system
- Dark mode toggle
- Pagination for large expense lists

---

**Submitted by**: [Your Full Name]  
**Date**: December 13, 2025  
**GitHub**: [your-github-username]  
**Contact**: [your-email or phone]

Thank you for the opportunity! I'm excited about the possibility of contributing to DataSturdy Consulting.
```

### Next: Create `DECISIONS.md`

Now create a file called `DECISIONS.md` in the root with this content:

```markdown
# DECISIONS.md - Technical Decisions & Rationale

## Technology Choices

**Why Node.js + Express for backend?**
- Fast, lightweight, and excellent for REST APIs
- Large ecosystem and easy JSON handling
- Familiarity and quick development in limited timeline

**Why MongoDB (Atlas)?**
- Flexible schema perfect for expense data
- Easy JSON-like documents
- Free tier sufficient for assignment
- Seamless integration with Node.js via Mongoose

**Why React (Vite) for frontend?**
- Modern, component-based UI
- Fast development with hot reload (Vite)
- Better than plain HTML/JS for state management and reusability

**Why plain CSS instead of Tailwind/Bootstrap?**
- Full control over design
- Smaller bundle size
- Professional, custom look without framework classes in HTML
- Easier to explain in interview

## Implementation Decisions

**Authentication**
- Used JWT in httpOnly cookies (secure, prevents XSS)
- No registration page as per requirements
- Seeded test users via separate `seed.js` script

**Database Schema**
- User: name, email, password (hashed), role
- Expense: userId, userName, amount, category, date, description, receiptDetails, status, comments, timestamps

**Role-based Access**
- Protected routes using middleware (`protect`, `managerOnly`)
- Frontend redirects based on user role

**Assumptions Made**
- One manager approves all expenses (no team hierarchy)
- Receipt upload not required → stored as text details
- Indian Rupee (₹) as currency
- Dates in Indian format

**Features Prioritized**
- Core functionality: submit, view, approve/reject
- Clean UI/UX with professional icons and responsive design
- Dashboard summaries for both roles
- Refresh capability and last updated time

## Challenges & Solutions

**Challenge**: CORS and cookie issues between frontend/backend
**Solution**: Proper CORS configuration with credentials, `withCredentials: true` in Axios

**Challenge**: Logout not working initially
**Solution**: Properly passed `setUser` from App.jsx to dashboards and Navbar

**Challenge**: Seeding data reliably
**Solution**: Created dedicated `seed.js` script instead of on-startup seeding

## Trade-offs & Shortcuts

- Used prompt() for manager comments (simple, no modal needed in time constraint)
- No form validation library (native HTML5 + required fields)
- No pagination (small dataset)
- Hardcoded categories (no admin panel)

## What I'd Improve with More Time
- Modal for approve/reject with better comment input
- File upload for receipts
- Search/filter expenses
- Expense editing (for pending ones)
- Better error handling and toast notifications
- Unit tests with Jest

This project was built with focus on **clean code, working functionality, security, and professional presentation**.
```


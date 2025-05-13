# Bank Hapoalim Student Profile Form

A web application for students to submit their academic and professional information to Bank Hapoalim's Poalim Start program.

## Features

- Responsive form design for all device sizes
- Client-side form validation
- Ready for MongoDB integration
- File upload capability for resume/CV

## Project Structure

```
bank-hapoalim-student-profile/
├── public/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── script.js
│   └── index.html
├── server.js
├── package.json
├── .env
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (for future integration)

## Setup Instructions

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/bank-hapoalim-student-db
   ```
4. Start the server:
   ```
   npm start
   ```
   or for development with auto-restart:
   ```
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:3000`

## Future Enhancements

- Connect to MongoDB to store student profiles
- Add authentication for admin access
- Implement file upload functionality to store CVs/resumes
- Create admin dashboard to view submitted profiles

## MongoDB Integration

The MongoDB connection is currently commented out in the server.js file. To enable it:

1. Ensure MongoDB is installed and running
2. Uncomment the MongoDB connection code in server.js
3. Update the MONGODB_URI in your .env file if needed
4. Update the form submission logic in public/js/script.js to make a real API call

## License

This project is proprietary software for Bank Hapoalim. 
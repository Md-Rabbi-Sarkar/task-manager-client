📋 Task Management Application
A responsive and intuitive Task Management App where users can add, edit, delete, and reorder tasks using a drag-and-drop interface. Tasks are categorized into To-Do, In Progress, and Done sections. All changes are instantly saved to a database to ensure data persistence. The application features a clean, minimalistic UI and works seamlessly on both desktop and mobile devices.

🔗 Live Links
🌐 Live Demo: task-manager.vercel.app
📂 API Endpoint: task-manager-api.vercel.app
⚙️ Dependencies
Frontend:

react – Core library for building UI
react-beautiful-dnd – Drag-and-drop functionality
axios – HTTP requests for API calls
tailwindcss – Styling and responsive design
react-toastify – Notifications and alerts
Backend:

express – Web framework for Node.js
mongoose – MongoDB object modeling for Node.js
cors – Enable Cross-Origin Resource Sharing
dotenv – Environment variable management
🚀 Installation Steps
Clone the Repository


git clone https://github.com/your-username/task-manager.git
cd task-manager
Install Dependencies for Frontend


cd client
npm install
Install Dependencies for Backend

cd ../server
npm install
Set Up Environment Variables

Create a .env file in the server directory:
ini
MONGO_URI=your_mongodb_connection_string
PORT=5000
Run the Application

Backend:
cd server
npm start
Frontend:
cd client
npm run dev
Deploy to Vercel (Optional)

Run:
vercel
🛠️ Technologies Used
Frontend:

React.js
Tailwind CSS
React Beautiful DnD
Axios
Backend:

Node.js
Express.js
MongoDB (Mongoose)
Vercel for Deployment


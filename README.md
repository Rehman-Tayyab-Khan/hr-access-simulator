# HR Access Simulation Tool

A Node.js Express application with EJS templating for simulating employee access to secure rooms.

## Features

- **Server-Side Rendering** with EJS templates
- **Employee Management** - Load and display employee access requests
- **Room Configuration** - Define access levels, time windows, and cooldown periods
- **Access Simulation** - Process requests with comprehensive business logic
- **Results Dashboard** - Detailed results with statistics and explanations

## Room Rules

| Room | Min Access Level | Open Time | Close Time | Cooldown (minutes) |
|------|------------------|-----------|------------|--------------------|
| ServerRoom    | 2       | 09:00     | 11:00 | 15 |
| Vault         | 3       | 09:00     | 10:00 | 30 |
| R&D Lab       | 1       | 08:00     | 12:00 | 10 |

## Setup Instructions

### 1. Create Project Structure
```bash
mkdir hr-access-simulator
cd hr-access-simulator
mkdir views public
```

### 2. Install Dependencies
```bash
npm init -y
npm install express ejs
npm install --save-dev nodemon
```

### 3. Create Files

**app.js** - Main Express application
**views/index.ejs** - Main EJS template
**package.json** - Dependencies and scripts

### 4. Run the Application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

### 5. Access the Application
Open your browser and go to: `http://localhost:3000`

## How It Works

### Business Logic
1. **Access Level Check** - Employee level must meet or exceed room requirement
2. **Time Window Check** - Request must be within room operating hours
3. **Cooldown Check** - Employee cannot access the same room within cooldown period

### Processing Flow
1. Load employee data (static JSON)
2. Sort requests chronologically
3. Process each request against room rules
4. Track access log for cooldown enforcement
5. Generate results with detailed explanations

### Sample Employee Data
The application includes 10 sample requests with:
- Different access levels (1, 2, 3)
- Various time slots
- Multiple room requests
- Duplicate requests to test cooldown logic

## API Endpoints

- `GET /` - Display main interface with employee data and room configuration
- `POST /simulate` - Process access simulation and display results

## File Structure
```
hr-access-simulator/
├── app.js                 # Express server and business logic
├── package.json           # Dependencies
├── views/
│   └── index.ejs         # Main template
├── public/               # Static assets (if needed)
└── README.md            # This file
```

## Technologies Used
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **EJS** - Templating engine
- **Font Awesome** - Icons
- **CSS3** - Styling with Grid and Flexbox

## Key Features
- ✅ Server-side rendering with EJS
- ✅ Responsive design
- ✅ Employee access level validation
- ✅ Time window enforcement
- ✅ Cooldown period tracking
- ✅ Detailed results with explanations
- ✅ Statistics dashboard
- ✅ Clean, professional UI

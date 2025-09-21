const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static('public'));
app.use(express.json());

// Employees
const employeeData = [
  { "id": "EMP001", "access_level": 2, "request_time": "09:15", "room": "ServerRoom" },
  { "id": "EMP002", "access_level": 1, "request_time": "09:30", "room": "Vault" },
  { "id": "EMP003", "access_level": 3, "request_time": "10:05", "room": "ServerRoom" },
  { "id": "EMP004", "access_level": 3, "request_time": "09:45", "room": "Vault" },
  { "id": "EMP005", "access_level": 2, "request_time": "08:50", "room": "R&D Lab" },
  { "id": "EMP006", "access_level": 1, "request_time": "10:10", "room": "R&D Lab" },
  { "id": "EMP007", "access_level": 2, "request_time": "10:18", "room": "ServerRoom" },
  { "id": "EMP008", "access_level": 3, "request_time": "09:55", "room": "Vault" },
  { "id": "EMP001", "access_level": 2, "request_time": "09:28", "room": "ServerRoom" },
  { "id": "EMP006", "access_level": 1, "request_time": "10:15", "room": "R&D Lab" }
];

// Rooms
const roomConfig = {
  "ServerRoom": {
    minAccessLevel: 2,
    openTime: "09:00",
    closeTime: "11:00",
    cooldownMinutes: 15
  },
  "Vault": {
    minAccessLevel: 3,
    openTime: "09:00",
    closeTime: "10:00",
    cooldownMinutes: 30
  },
  "R&D Lab": {
    minAccessLevel: 1,
    openTime: "08:00",
    closeTime: "12:00",
    cooldownMinutes: 10
  }
};

// time string to minutes
const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

const simulateAccess = (employees) => {
  const accessLog = {};
  const results = [];

  // requests by time
  const sortedRequests = [...employees].sort((a, b) => 
    timeToMinutes(a.request_time) - timeToMinutes(b.request_time)
  );

  sortedRequests.forEach((request, index) => {
    const { id, access_level, request_time, room } = request;
    const config = roomConfig[room];
    const requestMinutes = timeToMinutes(request_time);
    const openMinutes = timeToMinutes(config.openTime);
    const closeMinutes = timeToMinutes(config.closeTime);

    let granted = false;
    let reason = '';

    // Check access
    if (access_level < config.minAccessLevel) {
      reason = `Denied: Access level ${access_level} below required level ${config.minAccessLevel}`;
    }
    // Check room is open
    else if (requestMinutes < openMinutes || requestMinutes > closeMinutes) {
      reason = `Denied: Room closed (open ${config.openTime}-${config.closeTime})`;
    }
    // Check cooldown
    else if (accessLog[id] && accessLog[id][room]) {
      const lastAccess = accessLog[id][room];
      const timeDiff = requestMinutes - lastAccess;
      if (timeDiff < config.cooldownMinutes) {
        const remainingCooldown = config.cooldownMinutes - timeDiff;
        reason = `Denied: Cooldown active (${remainingCooldown} min remaining)`;
      } else {
        granted = true;
        reason = `Access granted to ${room}`;
      }
    }
    
    else {
      granted = true;
      reason = `Access granted to ${room}`;
    }

    
    if (granted) {
      if (!accessLog[id]) accessLog[id] = {};
      accessLog[id][room] = requestMinutes;
    }

    results.push({
      ...request,
      granted,
      reason,
      index: index + 1
    });
  });

  return results;
};

// routes
app.get('/', (req, res) => {
  res.render('index', { 
    employees: employeeData, 
    rooms: roomConfig,
    results: null 
  });
});

app.post('/simulate', (req, res) => {
  const results = simulateAccess(employeeData);
  const stats = {
    total: results.length,
    granted: results.filter(r => r.granted).length,
    denied: results.filter(r => !r.granted).length,
    successRate: Math.round((results.filter(r => r.granted).length / results.length) * 100)
  };
  
  res.render('index', { 
    employees: employeeData, 
    rooms: roomConfig,
    results: results,
    stats: stats
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
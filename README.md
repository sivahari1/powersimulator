# ⚡ Power Simulator

A real-time power and current simulation web application that simulates electrical load usage in a house. Built with React, Node.js, and Socket.IO for real-time updates.

## 🏠 House Layout

The simulator includes a complete house with the following rooms and devices:

### Rooms:
- **3 Bedrooms** - Each with tube light, fan, and AC
- **1 Hall** - With tube light and fan
- **1 Kitchen** - With tube light, fan, fridge, and grinder
- **1 Washroom** - With tube light, washing machine, and water heater
- **1 Garden** - No devices
- **1 Electricity Pole** - Power source (230V)

### Devices and Power Ratings:
- 💡 **Tube Light**: 40W
- 🌀 **Fan**: 60W
- ❄️ **AC**: 1500W
- 🧊 **Fridge**: 200W
- ⚙️ **Grinder**: 400W
- 👕 **Washing Machine**: 500W
- 🔥 **Water Heater**: 2000W

## 🚀 Features

- **Real-time Power Simulation**: Toggle devices on/off and see immediate power/current changes
- **Live Meters**: Digital displays for current power (Watts) and current (Amps)
- **Real-time Charts**: Graphical representation of power and current over time using Recharts
- **Device Status**: Visual indicators showing active/inactive status of all devices
- **Total Consumption**: Track total power consumption during the session
- **Responsive Design**: Modern UI with Tailwind CSS
- **Socket.IO Integration**: Real-time updates between frontend and backend

## 🛠️ Tech Stack

- **Frontend**: React 18, Tailwind CSS, Recharts
- **Backend**: Node.js, Express
- **Real-time**: Socket.IO
- **Build Tool**: Create React App

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Power-simulator
   ```

2. **Install dependencies**:
   ```bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Start the development servers**:
   ```bash
   # Start both server and client (recommended)
   npm run dev
   
   # Or start them separately:
   npm run server    # Backend on port 5000
   npm run client    # Frontend on port 3000
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000` to access the application.

## 🎮 How to Use

1. **Connect to Server**: The app will automatically connect to the backend server
2. **Toggle Devices**: Click on any device switch to turn it on/off
3. **Monitor Power**: Watch the real-time power and current meters update
4. **View Charts**: See the power consumption graph update in real-time
5. **Check Status**: Monitor active/inactive devices in the status panel
6. **Reset**: Use the "Reset Simulation" button to turn off all devices

## 📊 Dashboard Features

### Left Panel - House Layout
- Interactive room layout with device switches
- Visual feedback for active/inactive devices
- Power ratings displayed for each device

### Right Panel - Monitoring
- **Power Meters**: Real-time digital displays
- **Power Chart**: Live graph showing power and current over time
- **Device Status**: List of all devices with their current state

## 🔧 Development

### Project Structure
```
Power-simulator/
├── server/
│   └── index.js          # Backend server with Socket.IO
├── client/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── App.js        # Main app component
│   │   └── index.js      # React entry point
│   └── package.json      # Frontend dependencies
├── package.json          # Root dependencies
└── README.md
```

### Available Scripts
- `npm run dev` - Start both server and client
- `npm run server` - Start backend server only
- `npm run client` - Start frontend only
- `npm run build` - Build frontend for production
- `npm run install-all` - Install all dependencies

## 🌟 Key Features

### Real-time Updates
- Socket.IO ensures instant updates when devices are toggled
- Power calculations happen on the server and sync to all clients
- Chart updates in real-time as power consumption changes

### Power Calculation
- Total power = Sum of all active device power ratings
- Current = Power / Voltage (230V standard)
- Session consumption tracking

### Visual Design
- Modern, responsive UI with Tailwind CSS
- Animated device switches and meters
- Color-coded status indicators
- Professional dashboard layout

## 🔌 API Endpoints

- `GET /api/house-layout` - Get house layout and device configuration
- `GET /api/power-data` - Get current power data and history

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Enjoy simulating power consumption in your virtual house!** 🏠⚡ 
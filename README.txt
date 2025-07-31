Create a full-stack simulation web application to simulate real-time power and current variations in a house based on electrical load usage. Use React for the frontend, Node.js for the backend, and Socket.IO for real-time updates.

### Application Description:
Simulate a house with the following configuration:

🏠 **House Layout**
- 3 Bedrooms
- 1 Hall
- 1 Kitchen
- 1 Washroom
- 1 Garden
- 1 Electricity pole outside the house (power source)

💡 **Devices and Appliances**
- 1 Tube light per room (including hall, kitchen, washroom, bedrooms)
- 1 Fan in each room (total 5)
- AC in each bedroom (3 total)
- Fridge (in kitchen)
- Grinder (in kitchen)
- Washing Machine (in washroom)
- Water Heater (in washroom)

🔘 **Switches**
- Total 12 switches distributed across the house to turn devices on/off.

📟 **Meters**
- One digital display for **current (in Amps)**
- One digital display for **power (in Watts)**

📈 **Simulator Goals**
- Toggle switches to simulate turning devices on/off.
- Calculate and update power and current usage in real-time.
- Show a graphical chart for power/current over time.
- Show active/inactive status of each device.
- Display total power consumption in a session.

### Features to Include:
- Frontend dashboard with room layout and toggle switches
- Real-time display meters for power and current
- Real-time graph updates (chart.js or recharts)
- Backend simulation logic that calculates total power and current based on active devices
- Device power ratings (you can use default values like:
  - Tube light: 40W
  - Fan: 60W
  - AC: 1500W
  - Fridge: 200W
  - Grinder: 400W
  - Washing Machine: 500W
  - Heater: 2000W
)
- Use Socket.IO for updating frontend with real-time power/current data.

### Suggested Tech Stack:
- Frontend: React + Tailwind CSS
- Backend: Node.js + Express
- Realtime: Socket.IO
- Charting: Recharts or Chart.js

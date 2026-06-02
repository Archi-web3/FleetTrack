# 🚗 FleetTrack

**Fleet Management & E-Logbook Application for ACF**

FleetTrack is a comprehensive fleet management system designed for humanitarian organizations, featuring a web-based management interface and a mobile Progressive Web App (PWA) for drivers.

---

## 📋 Overview

FleetTrack provides end-to-end vehicle movement management with two main applications:

### 1. **Gestion des Déplacements** (Web Management Interface)
Administrative platform for planning, consolidating, validating, and tracking vehicle movements.

### 2. **E-Logbook** (Mobile PWA)
Driver-focused mobile application for real-time trip logging and vehicle data recording.

---

## 🏗️ Architecture

```
FleetTrack/
├── Angular/
│   ├── backend/              # Node.js/Express API server
│   ├── gestion-des-deplacements/  # Web management interface (Angular)
│   └── e-logbook/            # Mobile PWA (Angular)
├── Collections/              # Sample data collections
└── docs/                     # Documentation files
```

### Technology Stack

- **Frontend**: Angular 17+ with Material Design
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Mobile**: Progressive Web App (PWA)
- **Authentication**: JWT-based with role-based access control

---

## ✨ Key Features

### Web Management Interface
- 🔐 **Multi-role access control** (SuperAdmin, Admin, Supervisor, Technician, Driver)
- 🌍 **Multi-country & multi-base support** with logical data separation
- 📊 **Movement planning & consolidation** with vehicle/driver assignment
- ✅ **Multi-level validation workflow** (Security, Logistics, Fleet Manager)
- 📈 **Dashboard & reporting** with automated weekly reports
- 🔄 **Real-time synchronization** with mobile e-logbook
- 🚀 **Guest access** for inter-organization vehicle sharing (planned)

### Mobile E-Logbook (PWA)
- 📱 **Offline-first architecture** for areas with limited connectivity
- 🗺️ **GPS tracking** with automatic distance calculation
- ⛽ **Fuel consumption logging** with efficiency metrics
- 🔧 **Maintenance tracking** and incident reporting
- 📅 **Driver planning view** with assigned movements
- 🔄 **Automatic sync** when connection is available
- 📸 **Photo attachments** for incidents and maintenance

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB 6+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Archi-web3/FleetTrack.git
   cd FleetTrack
   ```

2. **Install backend dependencies**
   ```bash
   cd Angular/backend
   npm install
   ```

3. **Install web app dependencies**
   ```bash
   cd ../gestion-des-deplacements
   npm install
   ```

4. **Install mobile PWA dependencies**
   ```bash
   cd ../e-logbook
   npm install
   ```

### Configuration

1. **Backend configuration**
   
   Create `.env` file in `Angular/backend/`:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/fleettrack
   JWT_SECRET=your_secret_key_here
   NODE_ENV=development
   ```

2. **Frontend configuration**
   
   Update API endpoints in:
   - `Angular/gestion-des-deplacements/src/environments/environment.ts`
   - `Angular/e-logbook/src/environments/environment.ts`

### Running the Application

1. **Start MongoDB**
   ```bash
   mongod
   ```

2. **Start the backend server**
   ```bash
   cd Angular/backend
   npm start
   ```

3. **Start the web management interface**
   ```bash
   cd Angular/gestion-des-deplacements
   npm start
   ```
   Access at: `http://localhost:4200`

4. **Start the mobile e-logbook**
   ```bash
   cd Angular/e-logbook
   npm start
   ```
   Access at: `http://localhost:4201`

---

## 👥 User Roles & Permissions

| Role | Permissions |
|------|-------------|
| **SuperAdmin** | Full system access, country management, cross-country data view |
| **Admin** | Country-level administration, user management, all features within assigned country |
| **Superviseur** | Movement validation, base-level oversight, reporting |
| **Technicien** | Movement requests, basic data entry |
| **Chauffeur** | E-logbook access, trip logging, assigned movement view |

---

## 🌍 Multi-Tenancy Architecture

FleetTrack supports **multi-country and multi-base deployments** with logical data separation:

- **Countries (Missions)**: Top-level organizational units (e.g., ACF DRC, ACF Mali)
- **Bases**: Sub-units within countries (e.g., Kinshasa, Goma, Bamako)
- **Automatic filtering**: Users only see data relevant to their assigned base/country
- **SuperAdmin override**: Can switch between countries for global oversight

See [ARCHITECTURE_MULTI_SITES.md](ARCHITECTURE_MULTI_SITES.md) for detailed architecture documentation.

---

## 📱 Mobile PWA Features

The e-logbook is designed as a Progressive Web App for:

- **Installable**: Add to home screen on mobile devices
- **Offline-capable**: Full functionality without internet
- **Responsive**: Optimized for mobile and tablet screens
- **Fast**: Service worker caching for instant loading

### PWA Installation

On mobile devices:
1. Open the e-logbook URL in your browser
2. Tap "Add to Home Screen" when prompted
3. Launch from your home screen like a native app

---

## 🔒 Security

- **JWT authentication** with secure token storage
- **Role-based access control** (RBAC) at API level
- **Data encryption** in transit (HTTPS required for production)
- **Input validation** and sanitization
- **XSS and CSRF protection**

---

## 📊 Database Models

### Core Collections

- **Pays** (Countries): Mission-level organization
- **Bases**: Sub-locations within countries
- **Utilisateurs** (Users): System users with role assignments
- **Vehicules** (Vehicles): Fleet inventory
- **Mouvements** (Movements): Planned and executed trips
- **Logbook**: Driver trip logs with fuel, maintenance, incidents
- **Lieux** (Locations): GPS-tagged destinations

---

## 🛠️ Development

### Project Structure

```
Angular/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth & validation
│   └── server.js        # Express server
├── gestion-des-deplacements/
│   └── src/
│       ├── app/
│       │   ├── features/      # Feature modules
│       │   ├── core/          # Services & guards
│       │   └── shared/        # Shared components
│       └── environments/
└── e-logbook/
    └── src/
        ├── app/
        │   ├── features/      # Mobile features
        │   └── core/          # Services & sync
        └── manifest.webmanifest
```

### API Documentation

Backend API runs on `http://localhost:3000/api`

Key endpoints:
- `POST /api/auth/login` - User authentication
- `GET /api/mouvements` - List movements
- `GET /api/vehicules` - List vehicles
- `POST /api/logbook` - Create trip log
- `GET /api/pays` - List countries

---

## 📈 Roadmap

- [x] Core movement management
- [x] Multi-role authentication
- [x] E-logbook PWA with offline support
- [x] Multi-country architecture
- [ ] Guest access for inter-organization sharing
- [ ] Advanced analytics & reporting
- [ ] Mobile native apps (iOS/Android)
- [ ] Real-time GPS tracking
- [ ] Automated fuel efficiency alerts

---

## 📄 License

Proprietary - ACF Internal Use

---

## 👤 Author

**Jonathan** - [Archi-web3](https://github.com/Archi-web3)

---

## 🤝 Contributing

This is a private project for ACF. For internal contributions, please contact the project maintainer.

---

## 📞 Support

For issues or questions, please contact the development team or create an issue in this repository.

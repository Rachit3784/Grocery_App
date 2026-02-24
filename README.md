# 🛒 GroceryGo — High-Performance Grocery Delivery App

**GroceryGo** is a production-grade grocery delivery mobile application built with **React Native CLI**, designed for scalability, performance, and secure user experiences.

The app delivers a modern shopping workflow with real-time cart synchronization, intelligent location-based product fetching, and advanced session security including **Single Device Login**.

---

## ✨ Overview

GroceryGo is engineered with a **modular navigation architecture**, **secure authentication flow**, and **optimized data handling** to support real-world production environments.

It focuses on:

* Seamless user experience
* High-performance rendering
* Secure session management
* Scalable architecture
* Efficient network usage

---

## 🏗️ Technical Architecture

### 📱 Navigation Flow & Routing

The application follows a **hierarchical navigation structure** for scalability and maintainability:

* **Root Navigator**
  Controls switching between authentication and main application stacks based on user session state.

* **Auth Stack**
  Handles onboarding flow:

  * Welcome screens
  * OTP-based signup
  * JWT-secured login

* **Main Stack**
  Core application modules:

  * Home feed
  * Profile management
  * Order history

* **Bottom Tabs + Native Stacks**

  * Smooth screen transitions
  * High-level feature switching
  * Modular navigation organization

---

## 🔐 Security & Session Management

* **JWT Authentication**
  Secure client-server communication with token-based access.

* **Single Device Login (SDL)**
  Automatic session invalidation when user logs in from a new device.

* **Protected Routes**
  Higher-order authentication guards prevent unauthorized screen access.

---

## 🚀 Key Features

### 🛍️ Shopping Experience

* Blinkit-style horizontal category tray
* Optimized product listing using FlatList
* Pagination support for large data sets
* Pull-to-refresh functionality
* Debounced search to prevent excessive API calls
* Real-time cart updates with dynamic billing
* Automatic tax and delivery fee calculation

---

### 📍 Location & Logistics

* Live geolocation for delivery address detection
* Nearest dark store product fetching
* Location-based product availability

---

### 💳 Payments & Wallet

* Razorpay payment gateway integration
* In-app digital wallet
* One-click checkout experience

---

## 🛠️ Tech Stack

* **Framework:** React Native CLI
* **Navigation:** Native Stack + Bottom Tabs
* **State Management:** Redux Toolkit / Zustand (configurable)
* **Payments:** Razorpay SDK
* **Performance:**

  * Debounced search
  * Image caching
  * Optimized re-renders

---

## 📈 Performance Optimizations

* Efficient memory cleanup in side-effects
* Debounced search to reduce network load
* Modular navigation structure for scalability
* Optimized list rendering for high data volume

---

## 📸 Screenshots

| Home Screen        | Product Detail     | Wallet & Pay       |
| ------------------ | ------------------ | ------------------ |
| *(Add screenshot)* | *(Add screenshot)* | *(Add screenshot)* |

---

## 🔧 Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone <your-repository-link>
cd GroceryGo
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Link Native Assets

```bash
npx react-native link
```

---

## ▶️ Running the Application

### Start Metro Server

```bash
npm start
```

---

### Run on Android

```bash
npm run android
```

---

### Run on iOS

Install CocoaPods (first time only):

```bash
bundle install
bundle exec pod install
```

Run app:

```bash
npm run ios
```

---

## 🔄 Development

Edit `App.tsx` and save — Fast Refresh will automatically update the app.

Force reload:

* **Android:** Press `R` twice or open Dev Menu → Reload
* **iOS:** Press `R` in simulator

---

## 🧪 Troubleshooting

If the app fails to build:

* Verify environment setup
* Ensure Android/iOS SDK is configured
* Reinstall dependencies
* Clear Metro cache

---

## 🤝 Contributing

Contributions are welcome.
Feel free to open issues or submit pull requests.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Built with performance, scalability, and real-world production use in mind.

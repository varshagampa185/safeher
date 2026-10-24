# 🛡️ SafeHer – Women's Safety Web Application

**SafeHer** is a women’s safety web application designed to help users access emergency calling, manage trusted emergency contacts, and share their location quickly during unsafe situations.

The application provides a simple, user-friendly interface with safety-related features using HTML, CSS, and JavaScript.

## 📌 Project Overview

Women's safety is an important concern in today's world. SafeHer aims to provide a convenient way for users to access essential safety tools through a web application.

The application allows users to save emergency contacts, access the emergency calling option, obtain their current location, and prepare an emergency message that can include a Google Maps location link.

## ✨ Features

* 🚨 **Emergency Call:** Quick access to the emergency number 112.
* 👥 **Emergency Contacts:** Add, view, and delete trusted contacts.
* 📍 **Location Tracking:** Retrieve the user's current location using browser geolocation.
* 🗺️ **Google Maps Integration:** View the location on Google Maps.
* 💬 **Emergency Message:** Prepare an emergency message for a selected contact.
* 📱 **Message App Integration:** Open the device's supported messaging application with a prepared message.
* 🌙 **Dark Mode:** Switch between light and dark themes.
* 💾 **Local Storage:** Save emergency contacts and theme preferences in the browser.
* 🎨 **User-Friendly Interface:** Simple layout designed for easy navigation.

## 🛠️ Technologies Used

* **HTML5** – Structures the web application.
* **CSS3** – Provides styling, layout, and responsive design.
* **JavaScript** – Implements interactive features and application logic.
* **Browser Geolocation API** – Retrieves the user's location with permission.
* **Local Storage** – Stores emergency contacts and theme preferences locally.
* **Google Maps** – Displays the user's location on a map.

## 📂 Project Structure

```text
SafeHer/
│
├── index.html      # Main webpage
├── style.css       # Styles and layout
├── script.js       # Application functionality
└── README.md       # Project documentation
```

## 🚀 How to Run the Project

1. Download or clone this repository.
2. Open the project folder in Visual Studio Code or another code editor.
3. Make sure `index.html`, `style.css`, and `script.js` are in the same folder.
4. Open `index.html` in your web browser, or run it using the Live Server extension in Visual Studio Code.
5. Allow location access when prompted to use the location feature.
6. Add emergency contacts and explore the available features.

**Note:** Location access generally works best when the website is running on `localhost` or through HTTPS.

## ⚙️ How It Works

1. The user opens the SafeHer web application.
2. The user adds trusted people to the emergency contact list.
3. The application stores the contacts in the browser's local storage.
4. If needed, the user can retrieve their current location.
5. The user can prepare an emergency message and include a Google Maps location link.
6. The user can open a supported messaging application to review and send the message.
7. The emergency calling option provides quick access to the number 112.

## 🔮 Future Enhancements

* Integration with a secure backend and database.
* User registration and login.
* Automatic emergency notifications through a properly configured messaging service.
* Live location sharing with trusted contacts.
* GPS-based safety alerts.
* A dedicated mobile application.
* Multilingual support.
* Safety guidance and nearby emergency service information.

## 🔐 Privacy and Safety

* Emergency contacts are stored in the browser's local storage on the device.
* Location access requires the user's browser permission.
* The current version does not automatically send emergency messages or contact emergency services.
* Users should verify the recipient and message before sending.
* The application is a prototype and should not be relied on as the only safety measure during an emergency.

## 🎯 Project Objective

The main objective of SafeHer is to develop an accessible, easy-to-use web application that brings essential women's safety tools together in one place.

## 👩‍💻 Developed By

**Varsha Gampa**
Computer Science and Engineering (CSE)

## 📄 License

This project is intended for educational and learning purposes. You may add an open-source license if you wish to permit others to reuse or modify the code.

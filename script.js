
"use strict";

document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // GET HTML ELEMENTS
    // =====================================

    const darkModeBtn = document.getElementById("darkModeBtn");
    const themeIcon = document.getElementById("themeIcon");
    const themeText = document.getElementById("themeText");

    const contactForm = document.getElementById("contactForm");
    const contactName = document.getElementById("contactName");
    const contactPhone = document.getElementById("contactPhone");
    const contactRelation = document.getElementById("contactRelation");

    const contactList = document.getElementById("contactList");
    const contactCount = document.getElementById("contactCount");
    const emptyContacts = document.getElementById("emptyContacts");

    const prepareAlertBtn = document.getElementById("prepareAlertBtn");
    const alertComposer = document.getElementById("alertComposer");
    const alertForm = document.getElementById("alertForm");
    const alertContact = document.getElementById("alertContact");
    const alertMessage = document.getElementById("alertMessage");
    const shareLocationBtn = document.getElementById("shareLocationBtn");

    const getLocationBtn = document.getElementById("getLocationBtn");
    const locationStatus = document.getElementById("locationStatus");
    const coordinates = document.getElementById("coordinates");

    const latitudeElement = document.getElementById("latitude");
    const longitudeElement = document.getElementById("longitude");
    const accuracyElement = document.getElementById("accuracy");

    const mapLink = document.getElementById("mapLink");
    const shareLocationLinkBtn =
        document.getElementById("shareLocationLinkBtn");

    const toast = document.getElementById("toast");
    const year = document.getElementById("year");

    // =====================================
    // GENERAL UTILITIES
    // =====================================

    let toastTimer = null;
    let currentPosition = null;
    let isGettingLocation = false;

    function showToast(message) {
        if (!toast) return;

        toast.textContent = message;
        toast.classList.remove("hidden");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(function () {
            toast.classList.add("hidden");
        }, 3500);
    }

    function safeRead(key, fallback) {
        try {
            const value = localStorage.getItem(key);

            if (value === null) {
                return fallback;
            }

            return JSON.parse(value);
        } catch (error) {
            console.warn("Could not read browser storage:", error);
            return fallback;
        }
    }

    function safeWrite(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error("Could not save browser storage:", error);

            showToast(
                "Browser storage is unavailable. Your changes may not be saved."
            );

            return false;
        }
    }

    function makeElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text !== undefined && text !== null) {
            element.textContent = text;
        }

        return element;
    }

    function normalisePhone(phone) {
        return phone.replace(/[\s()-]/g, "");
    }

    // =====================================
    // DARK MODE
    // =====================================

    function applyTheme(isDark) {
        document.body.classList.toggle("dark-mode", isDark);

        if (themeIcon) {
            themeIcon.textContent = isDark ? "☀" : "☾";
        }

        if (themeText) {
            themeText.textContent = isDark ? "Light Mode" : "Dark Mode";
        }

        if (darkModeBtn) {
            darkModeBtn.setAttribute(
                "aria-label",
                isDark ? "Switch to light mode" : "Switch to dark mode"
            );
        }
    }

    let savedTheme = "light";

    try {
        savedTheme = localStorage.getItem("safeherTheme") || "light";
    } catch (error) {
        console.warn("Theme preference could not be read.");
    }

    applyTheme(savedTheme === "dark");

    if (darkModeBtn) {
        darkModeBtn.addEventListener("click", function () {
            const isDark = !document.body.classList.contains("dark-mode");

            applyTheme(isDark);

            try {
                localStorage.setItem(
                    "safeherTheme",
                    isDark ? "dark" : "light"
                );
            } catch (error) {
                console.warn("Theme preference could not be saved.");
            }
        });
    }

    // =====================================
    // TRUSTED CONTACTS
    // =====================================

    let contacts = safeRead("safeherContacts", []);

    if (!Array.isArray(contacts)) {
        contacts = [];
    }

    // Keep only contacts with valid expected fields.
    contacts = contacts.filter(function (contact) {
        return (
            contact &&
            typeof contact.id === "string" &&
            typeof contact.name === "string" &&
            typeof contact.phone === "string" &&
            typeof contact.relation === "string"
        );
    });

    function saveContacts() {
        safeWrite("safeherContacts", contacts);
    }

    function renderContacts() {

        contactList.replaceChildren();

        contactCount.textContent = String(contacts.length);

        emptyContacts.classList.toggle(
            "hidden",
            contacts.length > 0
        );

        contacts.forEach(function (contact) {

            const card = makeElement("article", "contact-item");

            const top = makeElement("div", "contact-item-top");

            const avatar = makeElement(
                "div",
                "contact-avatar",
                contact.name.trim().charAt(0).toUpperCase() || "?"
            );

            const main = makeElement("div", "contact-main");

            const name = makeElement("h4", "", contact.name);

            const relation = makeElement(
                "p",
                "",
                contact.relation
            );

            main.append(name, relation);
            top.append(avatar, main);

            const phone = makeElement(
                "p",
                "contact-phone",
                contact.phone
            );

            const actions = makeElement("div", "contact-actions");

            const callLink = document.createElement("a");
            callLink.className = "contact-action";
            callLink.textContent = "Call";
            callLink.href = "tel:" + normalisePhone(contact.phone);
            callLink.setAttribute("aria-label", "Call " + contact.name);

            const deleteButton = makeElement(
                "button",
                "contact-action delete",
                "Delete"
            );

            deleteButton.type = "button";
            deleteButton.addEventListener("click", function () {
                deleteContact(contact.id);
            });

            actions.append(callLink, deleteButton);

            card.append(top, phone, actions);
            contactList.appendChild(card);
        });

        renderAlertContactOptions();
    }

    function renderAlertContactOptions() {

        const previousValue = alertContact.value;

        alertContact.replaceChildren();

        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = contacts.length
            ? "Select a trusted contact"
            : "Add a trusted contact first";

        alertContact.appendChild(placeholder);

        contacts.forEach(function (contact) {

            const option = document.createElement("option");

            option.value = contact.id;
            option.textContent =
                contact.name + " (" + contact.relation + ")";

            alertContact.appendChild(option);
        });

        const stillExists = contacts.some(function (contact) {
            return contact.id === previousValue;
        });

        if (stillExists) {
            alertContact.value = previousValue;
        }
    }

    function deleteContact(id) {

        const contact = contacts.find(function (item) {
            return item.id === id;
        });

        if (!contact) return;

        const confirmed = window.confirm(
            "Delete " + contact.name + " from your trusted contacts?"
        );

        if (!confirmed) return;

        contacts = contacts.filter(function (item) {
            return item.id !== id;
        });

        saveContacts();
        renderContacts();

        showToast("Contact deleted.");
    }

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const name = contactName.value.trim();
            const phone = contactPhone.value.trim();
            const relation = contactRelation.value;

            if (!name || !phone || !relation) {
                showToast("Please complete all contact fields.");
                return;
            }

            // Basic phone validation.
            // Supports international numbers with an optional leading +.
            const phonePattern = /^\+?[0-9][0-9\s()-]{5,18}[0-9]$/;

            if (!phonePattern.test(phone)) {
                showToast("Please enter a valid phone number.");
                contactPhone.focus();
                return;
            }

            if (contacts.length >= 50) {
                showToast("You can save up to 50 contacts.");
                return;
            }

            const newContact = {
                id: (
                    window.crypto &&
                    typeof window.crypto.randomUUID === "function"
                )
                    ? window.crypto.randomUUID()
                    : Date.now().toString() + Math.random().toString(16).slice(2),

                name: name,
                phone: phone,
                relation: relation
            };

            contacts.push(newContact);

            saveContacts();
            renderContacts();

            contactForm.reset();

            showToast(name + " added to your trusted contacts.");
        });
    }

    renderContacts();

    // =====================================
    // LOCATION
    // =====================================

    function getMapURL(latitude, longitude) {
        return (
            "https://www.google.com/maps?q=" +
            encodeURIComponent(latitude + "," + longitude)
        );
    }

    function setLocationStatus(message) {
        locationStatus.textContent = message;
    }

    function updateLocation(position) {

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        currentPosition = {
            latitude: latitude,
            longitude: longitude,
            accuracy: accuracy
        };

        latitudeElement.textContent = latitude.toFixed(6);
        longitudeElement.textContent = longitude.toFixed(6);

        accuracyElement.textContent =
            "Approximately " + Math.round(accuracy) + " metres";

        coordinates.classList.remove("hidden");

        mapLink.href = getMapURL(latitude, longitude);
        mapLink.classList.remove("hidden");

        shareLocationLinkBtn.classList.remove("hidden");

        setLocationStatus(
            "Location found successfully. Review the coordinates below."
        );
    }

    function handleLocationError(error) {

        let message = "Unable to get your location.";

        if (error.code === 1) {
            message =
                "Location permission was denied. Allow location access in your browser settings.";
        } else if (error.code === 2) {
            message =
                "Your location is currently unavailable. Check your device's location settings.";
        } else if (error.code === 3) {
            message =
                "Location request timed out. Please try again.";
        }

        setLocationStatus(message);
        showToast(message);
    }

    function getCurrentLocation() {

        if (isGettingLocation) {
            showToast("Your location request is already in progress.");
            return;
        }

        if (!navigator.geolocation) {
            setLocationStatus(
                "Your browser does not support geolocation."
            );

            showToast("Geolocation is not supported by this browser.");
            return;
        }

        isGettingLocation = true;

        getLocationBtn.disabled = true;
        getLocationBtn.textContent = "Getting location...";

        setLocationStatus(
            "Waiting for your browser's location permission..."
        );

        navigator.geolocation.getCurrentPosition(

            function (position) {
                updateLocation(position);
                showToast("Your location has been updated.");
                finishLocationRequest();
            },

            function (error) {
                handleLocationError(error);
                finishLocationRequest();
            },

            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 0
            }
        );
    }

    function finishLocationRequest() {
        isGettingLocation = false;

        getLocationBtn.disabled = false;
        getLocationBtn.textContent = "📍 Get My Location";
    }

    if (getLocationBtn) {
        getLocationBtn.addEventListener("click", getCurrentLocation);
    }

    // =====================================
    // EMERGENCY MESSAGE
    // =====================================

    if (prepareAlertBtn) {
        prepareAlertBtn.addEventListener("click", function () {

            alertComposer.classList.toggle("hidden");

            const isOpen = !alertComposer.classList.contains("hidden");

            prepareAlertBtn.textContent = isOpen
                ? "✕ Close Alert Form"
                : "✉ Prepare Alert";

            if (isOpen) {
                alertComposer.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                if (contacts.length === 0) {
                    showToast(
                        "Add a trusted contact before preparing an alert."
                    );
                }
            }
        });
    }

    if (shareLocationBtn) {
        shareLocationBtn.addEventListener("click", function () {

            if (currentPosition) {

                const locationURL = getMapURL(
                    currentPosition.latitude,
                    currentPosition.longitude
                );

                const locationText =
                    "\n\nMy current location: " + locationURL;

                if (!alertMessage.value.includes(locationURL)) {
                    alertMessage.value =
                        alertMessage.value.trim() +
                        locationText;
                }

                showToast("Location link added to your message.");

                return;
            }

            showToast("Getting your location first...");

            if (!navigator.geolocation) {
                showToast("Your browser does not support geolocation.");
                return;
            }

            // Request location, then add it when successful.
            if (isGettingLocation) {
                showToast("Please wait for the location request to finish.");
                return;
            }

            if (!getLocationBtn.disabled) {
                getCurrentLocation();
            }

            const originalStatus = locationStatus.textContent;

            setLocationStatus(
                "Getting your location to add it to the message..."
            );

            const waitForLocation = setInterval(function () {

                if (currentPosition) {

                    clearInterval(waitForLocation);

                    const locationURL = getMapURL(
                        currentPosition.latitude,
                        currentPosition.longitude
                    );

                    if (!alertMessage.value.includes(locationURL)) {
                        alertMessage.value =
                            alertMessage.value.trim() +
                            "\n\nMy current location: " + locationURL;
                    }

                    showToast("Location link added to your message.");

                } else if (!isGettingLocation) {

                    clearInterval(waitForLocation);

                    if (
                        locationStatus.textContent.includes("Getting your location")
                    ) {
                        setLocationStatus(originalStatus);
                    }
                }

            }, 300);

            // Stop waiting after a reasonable timeout.
            setTimeout(function () {
                clearInterval(waitForLocation);
            }, 25000);
        });
    }

    // =====================================
    // OPEN MESSAGING APP
    // =====================================

    if (alertForm) {
        alertForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const selectedId = alertContact.value;

            const selectedContact = contacts.find(function (contact) {
                return contact.id === selectedId;
            });

            if (!selectedContact) {
                showToast("Please select a trusted contact.");
                alertContact.focus();
                return;
            }

            const message = alertMessage.value.trim();

            if (!message) {
                showToast("Please enter an emergency message.");
                alertMessage.focus();
                return;
            }

            const phone = normalisePhone(selectedContact.phone);

            const smsURL =
                "sms:" +
                encodeURIComponent(phone) +
                "?body=" +
                encodeURIComponent(message);

            // Open the device's messaging handler.
            // Actual delivery requires the user to send the message.
            window.location.href = smsURL;

            showToast(
                "Your messaging app should open. Review and send the message yourself."
            );
        });
    }

    // =====================================
    // SHARE LOCATION LINK
    // =====================================

    if (shareLocationLinkBtn) {
        shareLocationLinkBtn.addEventListener("click", async function () {

            if (!currentPosition) {
                showToast("Get your location before sharing it.");
                return;
            }

            const url = getMapURL(
                currentPosition.latitude,
                currentPosition.longitude
            );

            try {

                if (navigator.share) {

                    await navigator.share({
                        title: "My location",
                        text: "Here is my current location:",
                        url: url
                    });

                } else if (navigator.clipboard &&
                           window.isSecureContext) {

                    await navigator.clipboard.writeText(url);

                    showToast("Map link copied to your clipboard.");

                } else {

                    window.prompt("Copy your location link:", url);

                }

            } catch (error) {

                if (error.name !== "AbortError") {
                    showToast(
                        "Sharing was not completed. You can open the map link instead."
                    );
                }
            }
        });
    }

    // =====================================
    // FOOTER YEAR
    // =====================================

    if (year) {
        year.textContent = new Date().getFullYear();
    }

});
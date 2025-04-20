// This file handles user profile management, including saving and loading user data.

const userProfile = {
    username: '',
    highScore: 0,
    typingSpeed: 0,
};

// Function to save user profile data to local storage
function saveUserProfile() {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
}

// Function to load user profile data from local storage
function loadUserProfile() {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
        Object.assign(userProfile, JSON.parse(savedProfile));
    }
}

// Function to update user profile data
function updateUserProfile(newData) {
    Object.assign(userProfile, newData);
    saveUserProfile();
}

// Function to reset user profile data
function resetUserProfile() {
    userProfile.username = '';
    userProfile.highScore = 0;
    userProfile.typingSpeed = 0;
    saveUserProfile();
}

// Load user profile when the script is executed
loadUserProfile();
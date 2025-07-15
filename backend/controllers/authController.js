const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Otp = require('../models/otp');
const sendOTP = require('../utils/sendOtp');
const { sendRegistrationDetails } = require('../utils/sendOtp');

// In-memory store for verified contacts (reset on server restart)
const verifiedContacts = new Set();

exports.sendOtp = async (req, res) => {
  try {
    const { contact } = req.body;
    if (!contact) return res.status(400).json({ message: 'Please enter your email.' });
    const existingUser = await User.findOne({ email: contact });
    if (existingUser) return res.status(400).json({ message: 'This email is already registered. Please login.' });
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.deleteMany({ contact }); // remove old ones
    await Otp.create({ contact, otp: otpCode });
    await sendOTP(contact, otpCode);
    res.json({ message: 'OTP sent to your email.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP. Please try again.', error: err.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { contact, otp } = req.body;
    const existing = await Otp.findOne({ contact, otp });
    if (!existing) return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    await Otp.deleteMany({ contact }); // delete OTP after verification
    verifiedContacts.add(contact);
    res.json({ message: 'OTP verified. You can now complete registration.' });
  } catch (err) {
    res.status(500).json({ message: 'OTP verification failed. Please try again.', error: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!verifiedContacts.has(email)) {
      return res.status(400).json({ message: 'Please verify your email with OTP before registering.' });
    }
    // Prevent duplicate users
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'This email is already registered. Please login.' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    verifiedContacts.delete(email); // Remove after successful registration
    // Send registration details by email
    await sendRegistrationDetails(email, email, password);
    res.json({ message: 'Registration successful! Your login ID and password have been sent to your email.', user });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed. Please try again.', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { emailOrMobile, password } = req.body;
    const user = await User.findOne({ email: emailOrMobile });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }
    res.json({ message: 'Login successful!', user });
  } catch (err) {
    res.status(500).json({ message: 'Login failed. Please try again.', error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password reset successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Password reset failed. Please try again.', error: err.message });
  }
};

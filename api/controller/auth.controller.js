import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../modal/user.modal.js';
import { errorHandler } from '../utils/error.js';

export const signup = async (req, res, next) => {
  const { userName, email, password } = req.body;
  console.log(userName, email, password);

  // Check if all fields are provided
  if (!userName || !email || !password || userName.trim() === "" || email.trim() === "" || password.trim() === "") {
    return next(errorHandler(400, "All fields are required"));
  }

  // Hash the password
  const hashPassword = bcryptjs.hashSync(password, 10);

  // Create a new user instance
  const newUser = new User({
    userName,
    email,
    password: hashPassword
  });

  try {
    // Save user to the database
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    // Handle potential errors (e.g. duplicate email, database issues)
    next(errorHandler(500, error.message));
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email , password)

  // Check if email and password are provided
  if (!email || !password || email.trim() === "" || password.trim() === "") {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    // Find the user by email
    const validUser = await User.findOne({ email });
   
    if (!validUser) {
      return next(errorHandler(400, "Email is not found"));
    }

    // Check if the password is valid
    const validPassword = await bcryptjs.compare(password, validUser.password);
    console.log(validPassword)
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"));
    }
    console.log(validPassword)

    // Generate a JWT token
    const token = jwt.sign(
      { id: validUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }  // Token expires in 1 hour
    );
    console.log(validUser._doc)

    const {password:pass, email: e,...rest} = validUser._doc;

    // Send the token as an HTTP-only cookie and return the user data
    res.status(200)
      .cookie('access_token', token, { httpOnly: true })
      .json({ rest });
  } catch (error) {
    // Handle potential errors
    next(errorHandler(500, error.message));
  }
};

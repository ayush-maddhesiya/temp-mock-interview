import { isValidObjectId } from 'mongoose';
import User from '../models/user.js'; 
import { log } from 'console';

const registerUser = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  log(email, password, firstName, lastName);
  const user = new User({
    email,
    password,
    firstName,
    lastName,
  });

  await user.save();

  res.status(201).json({
    success: true,
    data: user,
  });
};

const getUser = async (req, res) => {
  const { id } = req.query; 
  console.log(`id: ${id}`);
  
  if(!id || isValidObjectId(id) === false){
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID',
    });
  }

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
};

export { registerUser, getUser }

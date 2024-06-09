const User = require('../model/UserModel.cjs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const nodemailer = require('nodemailer');

exports.signup = async (req, res) => {
  try {
    const {fullname, address, email, password} = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({email});
    if (existingUser) {
      return res.status(400).json({message: 'Email already exists!'});
    }

    // Create a new user
    const otp = Math.floor(100000 + Math.random() * 900000); // generates a 6-digit OTP
    const otpExpiry = new Date(Date.now() + 15*60*1000); // OTP expires in 15 minutes

    // Create a new user with the OTP details
    const newUser = new User({
      fullname,
      address,
      email,
      password,
      verified: false,
      otp: otp.toString(),
      otp_expiry: otpExpiry
    });
    console.log("newwwww",newUser),
    // Save the new user
    await newUser.save();
    // Configure mail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", 
         host: "smtp.ethereal.email", 
         port: 587, 
         secure: false, // true for 465, false for other ports
         auth: {
           user: "appshopium@gmail.com", // generated ethereal user
           pass: "tusxufzefsdsheyq" // generated ethereal password
         }
     });
     const msg = {
      from: "appshopium@gmail.com", // sender address
      to: newUser.email, // list of receivers
      subject: "Verify your account ✔", // Subject line
      text: "Hello world?", // plain text body
      html: `<h1>${otp}</h1>` // html body
    };
    await transporter.sendMail(msg,function(error,info){
         if (error) {
        console.log(error);
        return res.status(500).json({message: 'Error while sending OTP'});
      } else {
        console.log('Email sent: ' + info.response);
        res.status(201).json({message: 'User created successfully! Please check your email for the OTP.'});
      }
    });
    // Send OTP to user's email
    // const mailOptions = {
    //   from: 'gouadriafarouk05@gmail.com',
    //   to: email,
    //   subject: 'Verify Your Email',
    //   text: `Here is your OTP for email verification: ${otp}`
    // };

    // transporter.sendMail(mailOptions, function(error, info){
    //   if (error) {
    //     console.log(error);
    //     return res.status(500).json({message: 'Error while sending OTP'});
    //   } else {
    //     console.log('Email sent: ' + info.response);
    //     res.status(201).json({message: 'User created successfully! Please check your email for the OTP.'});
    //   }
    // });

  } catch (error) {
    console.error(error);
    return res.status(500).json({message: 'Error while signing up!'});
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log("reqq===>", email);

  try {
    const user = await User.findOne({ email: email });
    console.log("userrrr", user);

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if the user's account is verified
    if (!user.verified) {
      return res.status(401).json({ message: 'Please verify your account.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user: user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  console.log("emailll",email,otp)
  try {
    const user = await User.findOne({ email });
    console.log("userrrrrrrr",user)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP is expired
    if (user.otp_expiry < Date.now()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Verify the OTP
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    
    // Set the user as verified
    user.verified = true;
    user.otp = null; // Clear the OTP
    user.otp_expiry = null; // Clear the expiry
    await user.save();

    res.status(200).json({ message: 'User verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
};

exports.addFavorite = async (req, res) => {
  const { publicationId,userId,  } = req.body;
  console.log("userrrr",userId,publicationId)
  try {
    // Find user by ID
    // const objectId = new mongoose.Types.ObjectId(userId);
    // console.log("opbkecr===",objectId)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the publication is already in the favorites
    if (user.favorites.includes(publicationId)) {
      return res.status(400).json({ message: 'Publication already in favorites' });
    }

    // Add publication to favorites
    user.favorites.push(publicationId);
    await user.save();

    res.status(200).json({ message: 'Publication added to favorites', favorites: user.favorites });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getFavoritesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("userId===>",userId)
    const user = await User.findById(userId).populate('favorites'); // Assuming 'favorites' holds references to Publication documents

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.json(user.favorites);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

exports.deleteFav= async (req, res) => {
  const { userId, publicationId } = req.body;

  try {
    // Find the user and update their favorites
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { favorites: publicationId } },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.status(200).json({
      message: 'Favorite removed successfully',
      favorites: user.favorites
    });
  } catch (error) {
    console.error('Failed to remove favorite:', error);
    res.status(500).send('Internal server error');
  }
};
// require('dotenv').config();
// const express = require('express');
// const { createServer } = require('node:http');
// const { join } = require('node:path');
// const { Server } = require('socket.io');
// const mongoose = require('mongoose');
// const multer = require('multer');
// const cors = require('cors');
// const UserRouter = require("./roots/Userroot.cjs")
// const UserRouterLogin = require("./roots/Authroot.cjs");
// const UserRouterRegister = require("./roots/Userroot.cjs");
// const UserRouterPublication = require("./roots/PubRoute.cjs");
// const addpubController = require("./controllers/AddpubController.cjs");
// const Message = require('./model/message.cjs');
// const app = express();
// const server = createServer(app);
// const io = new Server(server);
// const upload = multer({ dest: "uploads/" });
// app.use(cors());

// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log('Connected to MongoDB');
//   })
//   .catch(error => {
//     console.log('Error connecting to MongoDB', error);
//   });

// app.use(express.json());

// app.get('/', (req, res) => {
//   res.sendFile(join(__dirname, 'index.html'));
// });

// const userSocketMap = {};

// const getSocketId = (userId) => {
//   return userSocketMap[userId];
// };

// io.on('connection', (socket) => {
//   console.log('a user connected', socket.id);

//   const userId = socket.handshake.query.userId;
//   if (userId !== 'undefined') {
//     userSocketMap[userId] = socket.id;
//   }

//   socket.on('disconnect', () => {
//     console.log('user disconnected', socket.id);
//     delete userSocketMap[userId];
//   });

//   socket.on('sendMessage', ({ senderId, receiverId, message }) => {
//     const receiverSocketId = getSocketId(receiverId);
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit('newMessage', {
//         senderId,
//         message,
//         timeStamp: new Date(),
//       });
//     }
//   });
// });

// app.use('/api', UserRouterLogin);
// app.use('/', UserRouterPublication);

// app.post('/sendMessage', async (req, res) => {
//   try {
//     const { senderId, receiverId, message } = req.body;

//     const newMessage = new Message({
//       senderId,
//       receiverId,
//       message,
//     });

//     await newMessage.save();

//     const receiverSocketId = userSocketMap[receiverId];
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit('newMessage', newMessage);
//     }

//     res.status(201).json(newMessage);
//   } catch (error) {
//     console.log('ERROR', error);
//     res.status(500).json({ message: 'Internal server problem' });
//   }
// });

// app.get('/messages', async (req, res) => {
//   try {
//     const { senderId, receiverId } = req.query;

//     const messages = await Message.find({
//       $or: [
//         { senderId: senderId, receiverId: receiverId },
//         { senderId: receiverId, receiverId: senderId },
//       ],
//     }).populate('senderId', '_id name');

//     res.status(200).json(messages);
//   } catch (error) {
//     console.log('Error', error);
//     res.status(500).json({ message: 'Internal server problem' });
//   }
// });

// app.get('/conversations/:userId', async (req, res) => {
//   try {
//     const { userId } = req.params;
//     console.log(userId);
//     const messages = await Message.find({
//       $or: [{ senderId: userId }, { receiverId: userId }],
//     }).populate('senderId receiverId', '_id name');

//     const conversations = messages.reduce((acc, message) => {
//       const otherUser = message.senderId._id === userId ? message.receiverId : message.senderId;
//       if (!acc[otherUser._id]) {
//         acc[otherUser._id] = {
// userId: otherUser._id,
//           userName: otherUser.name,
//           lastMessage: message.message,
//           timeStamp: message.timeStamp,
//         };
//       }
//       return acc;
//     }, {});

//     res.status(200).json(Object.values(conversations));
//   } catch (error) {
//     console.log('Error fetching conversations', error);
//     res.status(500).json({ message: 'Error fetching conversations' });
//   }
// });

// app.get('/users/:userId', async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const users = await User.find({_id: {$ne: userId}});

//     res.json(users);
//   } catch (error) {
//     console.log('Error', error);
//   }
// });

// app.get('/users/:userId', async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ message: 'Invalid user ID format' });
//     }const userIdd=new mongoose.Types.ObjectId(userId)
//     const user = await UserModel.findById({userId:userIdd}); // Assuming your user schema has name and image fields
//     console.log("user",user)
//     if (user) {
//       res.status(200).json(user);
//     } else{
// status(404).json({ message: 'User not found' });
//     }
//   } catch (error) {
//     console.log('Error fetching user details', error);
//     res.status(500).json({ message: 'Error fetching user details' });
//   }
// });

// server.listen(4000, () => {
//   console.log('server running at http://localhost:4000');
// });
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');

const app = express();
app.use('/uploads', express.static('uploads'));
const port = 4000;
const cors = require('cors');
app.use(cors());
const path = require('path');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
const multer=   require('multer');
const jwt = require('jsonwebtoken');

const UserRouterLogin = require("./roots/Authroot.cjs");
const UserRouterRegister = require("./roots/Userroot.cjs");
// const UserRouterProfile = require("./roots/profileRoutes.cjs");
const UserRouterPublication = require("./roots/PubRoute.cjs");
const addpubController = require("./controllers/AddpubController.cjs");
const upload = multer({ dest: "uploads/" });

mongoose
  .connect('mongodb+srv://test:test@testsocket.9bowssb.mongodb.net/')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.log('Error connecting to MongoDB');
  });


  // app.use(UserRouterLogin);
  app.use('/users',UserRouterRegister);
  // app.use(UserRouterProfile);
  app.use(UserRouterPublication);
app.listen(port, () => {
  console.log('Server is running on port 4000');
});
const http = require('http').createServer(app);

const io = require('socket.io')(http);

//{"userId" : "socket ID"}

const userSocketMap = {};

io.on('connection', socket => {
  console.log('a user is connected', socket.id);

  const userId = socket.handshake.query.userId;

  console.log('userid', userId);

  if (userId !== 'undefined') {
    userSocketMap[userId] = socket.id;
  }

  console.log('user socket data', userSocketMap);

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
    delete userSocketMap[userId];
  });

  socket.on('sendMessage', ({senderId, receiverId, message}) => {
    const receiverSocketId = userSocketMap[receiverId];

    console.log('receiver Id', receiverId);
     console.log('receiverSocketId Id', receiverSocketId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receiveMessage', {
        senderId,
        message,
      });
    }
  });
});

http.listen(3000, () => {
  console.log('Socket.IO running on port 3000');
});
const User = require('./model/UserModel.cjs');
const Message = require('./model/message.cjs');
const UserModel = require('./model/UserModel.cjs');

app.use('/api', UserRouterLogin);



app.get('/conversations/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const messages = await Message.find({
        $or: [{ senderId: userId }, { receiverId: userId }],
      }).populate('senderId receiverId', '_id name');
  
      const conversations = messages.reduce((acc, message) => {
        const otherUser = message.senderId._id === userId ? message.receiverId : message.senderId;
        if (!acc[otherUser._id]) {
          acc[otherUser._id] = {
            userId: otherUser._id,
            userName: message.userName,
            lastMessage: message.message,
            timeStamp: message.timeStamp,
          };
        }
        return acc;
      }, {});
  
      res.status(200).json(Object.values(conversations));
    } catch (error) {
      console.log('Error fetching conversations', error);
      res.status(500).json({ message: 'Error fetching conversations' });
    }
  });
// app.post('/register', async (req, res) => {
//   const {name, email, password, image} = req.body;

//   const newUser = new User({name, email, password, image});

//   newUser
//     .save()
//     .then(() => {
//       res.status(200).json({message: 'User registered succesfully!'});
//     })
//     .catch(error => {
//       console.log('Error creating a user');
//       res.status(500).json({message: 'Error registering the user'});
//     });
// });

// app.post('/login', async (req, res) => {
//   try {
//     const {email, password} = req.body;

//     const user = await User.findOne({email});
//     if (!user) {
//       return res.status(401).json({message: 'Invalid email'});
//     }

//     // if (user.password !== password) {
//     //   return res.status(401).json({message: 'Invalid password'});
//     // }

//     const secretKey = crypto.randomBytes(32).toString('hex');

//     const token = jwt.sign({userId: user._id}, secretKey);

//     res.status(200).json({token});
//   } catch (error) {
//     console.log('error loggin in', error);
//     res.status(500).json({message: 'Error loggin In'});
//   }
// });

app.get('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const users = await User.find({_id: {$ne: userId}});

    res.json(users);
  } catch (error) {
    console.log('Error', error);
  }
});
app.get('/users/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID format' });
      }const userIdd=new mongoose.Types.ObjectId(userId)
      const user = await UserModel.findById({userId:userIdd}); // Assuming your user schema has name and image fields
      console.log("user",user)
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.log('Error fetching user details', error);
      res.status(500).json({ message: 'Error fetching user details' });
    }
  });
// app.post('/sendrequest', async (req, res) => {
//   const {senderId, receiverId, message} = req.body;

//   console.log(senderId);
//   console.log(receiverId);
//   console.log(message);

//   const receiver = await User.findById(receiverId);
//   if (!receiver) {
//     return res.status(404).json({message: 'Receiver not found'});
//   }

//   receiver.requests.push({from: senderId, message});
//   await receiver.save();

//   res.status(200).json({message: 'Request sent succesfully'});
// });

app.get('/getrequests/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate(
      'requests.from',
      'name email image',
    );

    if (user) {
      res.json(user.requests);
    } else {
      res.status(400);
      throw new Error('User not found');
    }
  } catch (error) {
    console.log('error', error);
  }
});

app.post('/acceptrequest', async (req, res) => {
  try {
    const {userId, requestId} = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {requests: {from: requestId}},
      },
      {new: true},
    );

    if (!updatedUser) {
      return res.status(404).json({message: 'Request not found'});
    }

    await User.findByIdAndUpdate(userId, {
      $push: {friends: requestId},
    });

    const friendUser = await User.findByIdAndUpdate(requestId, {
      $push: {friends: userId},
    });

    if (!friendUser) {
      return res.status(404).json({message: 'Friend not found'});
    }

    res.status(200).json({message: 'Request accepted sucesfully'});
  } catch (error) {
    console.log('Error', error);
    res.status(500).json({message: 'Server Error'});
  }
});

app.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const users = await User.findById(userId).populate(
      'friends',
      'name email image',
    );

    res.json(users.friends);
  } catch (error) {
    console.log('Error fetching user', error);
  }
});



app.post('/sendMessage', async (req, res) => {
  try {
    const {senderId, receiverId, message,userName} = req.body;
    console.log({req:req.body})
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      userName
    });
    console.log({newMessage})
    await newMessage.save();

    const receiverSocketId = userSocketMap[receiverId];

    if (receiverSocketId) {
      console.log('emitting recieveMessage event to the reciver', receiverId);
      io.to(receiverSocketId).emit('newMessage', newMessage);
    } else {
      console.log('Receiver socket ID not found');
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log('ERROR', error);
  }
});

app.get('/messages', async (req, res) => {
  try {
    const {senderId, receiverId} = req.query;

    const messages = await Message.find({
      $or: [
        {senderId: senderId, receiverId: receiverId},
        {senderId: receiverId, receiverId: senderId},
      ],
    }).populate('senderId', '_id name');

    res.status(200).json(messages);
  } catch (error) {
    console.log('Error', error);
  }
});
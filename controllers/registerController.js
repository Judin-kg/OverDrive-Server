// const RegisterUser = require("../models/RegisterUser");

// // Register Controller
// exports.registerUser = async (req, res) => {
//   try {
//     const { name, phone, adress } = req.body;

//     if (!name || !phone || !adress) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     if (!/^[0-9]{10}$/.test(phone)) {
//       return res
//         .status(400)
//         .json({ message: "Phone number must be exactly 10 digits" });
//     }

//     const newUser = new RegisterUser({ name, phone, adress });
//     await newUser.save();

//     res.status(201).json({
//       message: "Registration successful",
//       user: newUser,
//     });
//   } catch (error) {
//     console.log("Register Error:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };



const RegisterUser = require("../models/RegisterUser");
const axios = require("axios");

// Register Controller
exports.registerUser = async (req, res) => {
  try {
    const { name, phone, adress } = req.body;

    if (!name || !phone || !adress) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      return res
        .status(400)
        .json({ message: "Phone number must be exactly 10 digits" });
    }

    // Check if phone already exists
    const existingUser = await RegisterUser.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({
        message: "This phone number is already registered",
      });
    }

    // Save user
    const newUser = new RegisterUser({ name, phone, adress });
    await newUser.save();

    // ----------------------------------------
    // 🔔 SEND WHATSAPP MESSAGE USING WAICHAT
    // ----------------------------------------


    // try {
    //   let contactNumber = phone;

    //   // Add India Country Code
    //   if (!contactNumber.startsWith("91")) {
    //     contactNumber = `91${contactNumber}`;
    //   }

    //   const waichatPayload = {
    //     number: contactNumber,
    //     type: "text",
    //     message: `🎉 *Registration Successful!*\n\nDear *${name}*,\nThank you for registering with us.\n\n📱 Phone: ${phone}\n🏠 Address: ${adress}\n\nOur team will contact you soon.\n\nRegards,\nNew Over Drive`,
    //     instance_id: "68E0E2878A990", // Your Waichat Instance ID
    //     access_token: "68de6bd371bd8", // Your Waichat Access Token
    //   };

    //   const waResp = await axios.post("https://waichat.com/api/send", waichatPayload);

    //   console.log("✅ WhatsApp sent:", waResp.data);
    // } catch (waErr) {
    //   console.log("❌ WhatsApp Error:", waErr.response?.data || waErr.message);
    // }




    try {
  // Always send WhatsApp to this number
  let contactNumber = "9745507607";

  // Add India country code
  if (!contactNumber.startsWith("91")) {
    contactNumber = `91${contactNumber}`;
  }

  const waichatPayload = {
    number: contactNumber,
    type: "text",
    message: `🎉 *New Registration Alert!*\n\nName: ${name}\n📱 Phone: ${phone}\n🏠 Address: ${adress}\n\nA new user just registered.`,
    instance_id: "68E0E2878A990",
    access_token: "68de6bd371bd8",
  };

  const waResp = await axios.post("https://waichat.com/api/send", waichatPayload);

  console.log("✅ WhatsApp sent:", waResp.data);

} catch (waErr) {
  console.log("❌ WhatsApp Error:", waErr.response?.data || waErr.message);
}


    // ----------------------------------------

    res.status(201).json({
      message: "Registration successful",
      user: newUser,
    });
  } catch (error) {
    console.log("Register Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};



// Get All Registered Users
exports.getUsers = async (req, res) => {
  try {
    const users = await RegisterUser.find().sort({ _id: -1 });
    res.status(200).json({ total: users.length, users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};
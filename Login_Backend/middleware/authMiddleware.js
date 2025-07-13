const jwt = require("jsonwebtoken");
const Users = require("../model/User");

const blacklist = []; // 🔴 In-memory token blacklist


exports.protect = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token" });
    }

    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, "your_jwt_secret");
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

// ✅ Logout handler
exports.logout = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token to logout" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // ✅ Decode the token to get the user ID
    const decoded = jwt.verify(token, "your_jwt_secret"); // use same secret as login
    const userId = decoded.id;

    // ✅ Update isActive = false in the DB
    await Users.findByIdAndUpdate(userId, { isActive: false });

    // ✅ Blacklist the token
    blacklist.push(token);

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(401).json({ message: "Invalid token", error: err.message });
  }
};


import jwt from "jsonwebtoken";

/**
 * protect - Middleware to verify the user's JWT and attach user info to req.user.
 */
export const protect = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Attach user data to req.user
      req.user = {
        userId: decoded.userId,
        role: decoded.role,
        schoolId: decoded.schoolId || null,
      };
      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

/**
 * authorizeRoles - Generic middleware to check if the user's role is one of the allowed roles.
 * Usage: router.use(authorizeRoles("admin", "schoolAdmin"))
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (req.user && allowedRoles.includes(req.user.role)) {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "Access denied: insufficient permissions" });
    }
  };
};

/**
 * isAdmin - Middleware to check if the user has the "admin" role.
 */
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Requires admin role" });
  }
};

/**
 * isSchoolAdmin - Middleware to check if the user has the "schoolAdmin" role.
 */
export const isSchoolAdmin = (req, res, next) => {
  if (req.user && req.user.role === "schoolAdmin") {
    next();
  } else {
    return res.status(403).json({ message: "Requires school admin role" });
  }
};

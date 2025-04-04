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
        zoneId: decoded.zoneId || null,
        districtId: decoded.districtId || null,
        employeeId: decoded.employeeId || null,
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
 * Usage: router.use(authorizeRoles("CEO", "ZEO", "schoolAdmin", "staff"))
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
 * isCEO - Middleware to check if the user has the "CEO" role.
 */
export const isCEO = (req, res, next) => {
  if (req.user && req.user.role === "CEO") {
    next();
  } else {
    return res.status(403).json({ message: "Requires CEO role" });
  }
};

/**
 * isZEO - Middleware to check if the user has the "ZEO" role.
 */
export const isZEO = (req, res, next) => {
  if (req.user && req.user.role === "ZEO") {
    next();
  } else {
    return res.status(403).json({ message: "Requires ZEO role" });
  }
};

/**
 * isSchoolAdmin - Middleware to check if the user has the "schoolAdmin" role.
 */
export const isSchoolAdmin = (req, res, next) => {
  if (req.user && req.user.role === "schoolAdmin") {
    next();
  } else {
    return res.status(403).json({ message: "Requires schoolAdmin role" });
  }
};

/**
 * isStaff - Middleware to check if the user has the "staff" role.
 */
export const isStaff = (req, res, next) => {
  if (req.user && req.user.role === "staff") {
    next();
  } else {
    return res.status(403).json({ message: "Requires staff role" });
  }
};

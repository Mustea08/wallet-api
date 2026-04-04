import ratelimiter from "../config/upStash.js";

const rateLimiter = async (req, res, next) => {
  try {
    const limit = await ratelimiter.limit(req.ip);
    if (!limit.success) {
      return res
        .status(429)
        .json({ message: "Too many requests, please try again later" });
    }
    next();
  } catch (error) {
    console.log("Error in rate limiting", error);
    // res.status(500).json({ message: "Error in rate limiting" });
    next(error);
  }
};

export default rateLimiter;

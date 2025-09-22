import jwt from "jsonwebtoken";

// const JWT_SECRET = "motorsonlie";
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export function createJwt(user) {
  return jwt.sign(
    {
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
}
import type { UserType } from "../models/User";
import jwt from "jsonwebtoken";

export default function assignToken(user: UserType) {
  const data = {
    user: {
      id: user.id,
    },
  };
  if (!process.env.AUTH_SEC_KEY)
    throw new Error("Authentication Secret Not Found.");

  const authToken = jwt.sign(data, process.env.AUTH_SEC_KEY, {
    expiresIn: "5h",
  });
  return authToken;
}

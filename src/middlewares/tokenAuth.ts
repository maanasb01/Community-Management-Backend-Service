import { Request, Response, NextFunction, Express } from "express";
import jwt from "jsonwebtoken";
import { IRequest } from "../types";

export const tokenAuth = (req: IRequest, res: Response, next: NextFunction) => {
  const sessionToken = req.cookies.access_token;

  if (!process.env.AUTH_SEC_KEY)
    throw new Error("AUTH_SEC_KEY environment variable not found.");

  if (sessionToken) {
    jwt.verify(
      sessionToken,
      process.env.AUTH_SEC_KEY,
      (err: Error | null, data: any) => {
        if (err) {
          return res.sendStatus(403);
        } else {
          // data.user has only the "id" field.
          req.user = data.user;
          next();
        }
      }
    );
  } else {
    res.sendStatus(401);
  }
};

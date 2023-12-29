import { Router, Response, Request,Express } from "express";
import { body, validationResult } from "express-validator";
import { User } from "../models/User";
import { Snowflake } from "@theinternetfolks/snowflake";
import getSecuredPasswordHash from "../lib/getSecuredPasswordHash";
import assignToken from "../lib/assignToken";
import bcrypt from "bcryptjs";
import { tokenAuth } from "../middlewares/tokenAuth";
import { IRequest } from "../types";

const router = Router();

//User SignUp Route. POST:/v1/auth/signup
router.post(
  "/signup",
  [
    body("name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name should have at least 2 characters"),
    body("email").isEmail().withMessage("Please Provide a Valid Email"),
    body("password")
      .exists()
      .isStrongPassword({
        minLength: 6,
        minUppercase: 0,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must be at least 6 characters long. It must contain at least one letter, one number and one special character."
      ),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, errors: errors.array() });
    }
    const secPassword = await getSecuredPasswordHash(req.body.password);

    try {
      const user = await User.create({
        id: Snowflake.generate(),
        name: req.body.name,
        email: req.body.email,
        password: secPassword,
      });
      const authToken = assignToken(user);

      const content = {
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_At: user.createdAt,
        },
      };
      res
        .status(201)
        .cookie("access_token", authToken, {
          expires: new Date(Date.now() + 5 * 60 * 60 * 60),
          httpOnly: true,
        })
        .json({ status: true, content });
    } catch (error: any) {
      res.status(500).json({ status: false, error: error.message });
    }
  }
);

//User Sign In Route. POST: /v1/auth/signin
router.post(
  "/signin",
  [
    body("email").isEmail().withMessage("Please Enter a Valid Email"),
    body("password").exists().withMessage("Password is Missing"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, error: errors.array() });
    }
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "Invalid Credentials" });
      }
      const passwordMached = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!passwordMached) {
        return res
          .status(404)
          .json({ status: false, message: "Invalid Credentials" });
      }
      const authToken = assignToken(user);

      const content = {
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_At: user.createdAt,
        },
      };
      res
        .status(201)
        .cookie("access_token", authToken, {
          expires: new Date(Date.now() + 5 * 60 * 60 * 60),
          httpOnly: true,
        })
        .json({ status: true, content });
    } catch (error: any) {
      res.status(500).json({ status: false, error: error.message });
    }
  }
);

router.get("/me", tokenAuth, async (req: IRequest, res: Response) => {
    try {
      if(!req.user){
        return res.status(400);
      }
      const userId = req.user.id;
      const user = await User.findOne({ id: userId });
  
      if (!user) {
        return res.status(404).json({ status: false, message: "User not found" });
      }
  
      const content = {
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_At: user.createdAt,
        },
      };
  
      res.status(200).json({ status: true, content});
    } catch (error:any) {
      res.status(500).json({ status: false, message: "Internal Server Error",error:error.message });
    }
  });
  

export default router;

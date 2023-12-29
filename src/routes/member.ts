import { Router, Response} from "express";
import { body, validationResult } from "express-validator";
import { Snowflake } from "@theinternetfolks/snowflake";
import { tokenAuth } from "../middlewares/tokenAuth";
import { IRequest } from "../types";
import { Role } from "../models/Role";
import { Community} from "../models/Community";
import { Member} from "../models/Member";
import { User } from "../models/User";

const router = Router();

//Add Member. POST:v1/member
router.post(
  "/",
  tokenAuth,
  [
    body("community").exists().withMessage("Missing Community Id"),
    body("user").exists().withMessage("Missing User Id"),
    body("role").exists().withMessage("Missing Role Id"),
  ],
  async (req: IRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, errors: errors.array() });
    }
    try {
      const { community: communityId, user: userId, role: roleId } = req.body;
      if (!req.user) {
        return res.status(400);
      }
      const currentUserId = req.user.id;
      const community = await Community.findOne({ id: communityId });
      if (!community) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid Community Id" });
      }

      if (currentUserId !== community.owner) {
        return res.status(403).json({
          status: false,
          message: "Access not Allowed",
          error: "NOT_ALLOWED_ACCESS",
        });
      }

      const role = await Role.findOne({ id: roleId });
      if (!role) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid Role Id" });
      }
      const user = await User.findOne({ id: userId });
      if (!user) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid User Id" });
      }

      const newMember = await Member.create({
        id: Snowflake.generate(),
        community: community.id,
        user: userId,
        role: role.id,
      });

      const response = {
        status: true,
        content: {
          data: {
            id: newMember.id,
            community: community.id,
            user: user.id,
            role: role.id,
            created_at: newMember.createdAt,
          },
        },
      };
      res.status(201).json(response);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
);

//Delete Member. DELETE:/v1/member
router.delete("/:id", async (req: IRequest, res: Response) => {
  try {

    if (!req.user) {
      return res.status(400);
    }
    const currentUserId = req.user.id;
    const removeMemberId = req.params.id;

    const removeMember = await Member.findOne({ id: removeMemberId });
    if (!removeMember) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid Member Id" });
    }
    const removeCommunity = await Community.findOne({
      id: removeMember.community,
    });
    if (!removeCommunity) {
      return res.status(400).json({ status: false, message: "Invalid Member" });
    }

    const communityAdminRole = await Role.findOne({ name: "Community Admin" });
    const communityModeratorRole = await Role.findOne({
      name: "Community Moderator",
    });

    if (!communityAdminRole) {
      return res
        .status(400)
        .json({ status: false, message: "No Admin Role FOund" });
    }

    const currentUserMember = await Member.findOne({ user: currentUserId });

    if (!currentUserMember) {
      return res
        .status(400)
        .json({ status: false, message: "NOT_ALLOWED_ACCESS" });
    }

    if (
      currentUserMember.role !== communityAdminRole.id &&
      currentUserMember.role !== communityModeratorRole?.id
    ) {
      return res
        .status(403)
        .json({
          status: false,
          message: "Forbidden",
          error: "NOT_ALLOWED_ACCESS",
        });
    }

    await removeMember.deleteOne();

    res.status(200).json({ status: true });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

export default router;

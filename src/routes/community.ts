import { Router, Response, Request, Express } from "express";
import { body, validationResult } from "express-validator";
import { Snowflake } from "@theinternetfolks/snowflake";
import { tokenAuth } from "../middlewares/tokenAuth";
import { IRequest } from "../types";
import { Role } from "../models/Role";
import { Community, CommunityType } from "../models/Community";
import { Member, MemberType } from "../models/Member";
import { User } from "../models/User";

const router = Router();

//Create Community
router.post(
  "/",
  tokenAuth,
  [
    body("name")
      .exists()
      .trim()
      .isLength({ min: 2 })
      .withMessage("Community Name should at least be of 2 characters"),
  ],
  async (req: IRequest, res: Response) => {
    try {
      const owner = req.user?.id;
      const slug = req.body.name.toLowerCase().replace(/ /g, "-");
      const community = await Community.create({
        id: Snowflake.generate(),
        name: req.body.name,
        slug,
        owner,
      });
      let role;
      const adminRole = await Role.findOne({ name: "Community Admin" });
      if (!adminRole) {
        const newRole = await Role.create({
          id: Snowflake.generate(),
          name: "Community Admin",
        });
        role = newRole;
      } else {
        role = adminRole;
      }

      const newMember = await Member.create({
        id: Snowflake.generate(),
        community: community.id,
        user: owner,
        role: role.id,
      });

      const response = {
        status: true,
        content: {
          data: {
            id: community.id,
            name: community.name,
            slug,
            owner,
            created_at: community.createdAt,
            updated_at: community.updatedAt,
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

//Get all Communities. GET /v1/community
router.get("/", tokenAuth, async (req: IRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = 10;

    const communities = await Community.find({})
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const total = await Community.countDocuments({});
    const totalPages = Math.ceil(total / pageSize);

    const responseData = {
      status: true,
      content: {
        meta: {
          total,
          pages: totalPages,
          page,
        },
        data: await Promise.all(
          communities.map(async (community: CommunityType) => {
            const owner = await User.findOne({ id: community.owner });
            return {
              id: community.id,
              name: community.name,
              slug: community.slug,
              owner: {
                id: community.owner,
                name: owner ? owner.name : null,
              },
              created_at: community.createdAt,
              updated_at: community.updatedAt,
            };
          })
        ),
      },
    };

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: "Internal Server Error" });
  }
});

//Get Community Members
router.get("/:id/members", tokenAuth, async (req: Request, res: Response) => {
  try {
    const communityId = req.params.id;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = 10;

    const members = await Member.find({ community: communityId })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const total = await Member.countDocuments({ community: communityId });
    const totalPages = Math.ceil(total / pageSize);

    const data = await Promise.all(
      members.map(async (member: MemberType) => {
        const user = await User.findOne({ id: member.user });
        const role = await Role.findOne({ id: member.role });

        return {
          id: member.id,
          community: member.community,
          user: {
            id: user?.id,
            name: user?.name,
          },
          role: {
            id: role?.id,
            name: role?.name,
          },
          created_at: member.createdAt,
        };
      })
    );

    const responseData = {
      status: true,
      content: {
        meta: {
          total,
          pages: totalPages,
          page,
        },
        data,
      },
    };

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: "Internal Server Error" });
  }
});

//Get Owned Communities
router.get("/me/owner", tokenAuth, async (req: IRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(400);
    }
    const ownerId = req.user.id;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = 10;

    const communities = await Community.find({ owner: ownerId })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const total = await Community.countDocuments({ owner: ownerId });
    const totalPages = Math.ceil(total / pageSize);

    const responseData = {
      status: true,
      content: {
        meta: {
          total,
          pages: totalPages,
          page,
        },
        data: communities.map((community: CommunityType) => ({
          id: community.id,
          name: community.name,
          slug: community.slug,
          owner: community.owner,
          created_at: community.createdAt,
          updated_at: community.updatedAt,
        })),
      },
    };

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: "Internal Server Error" });
  }
});

//Get Joined Communities
router.get("/me/member",tokenAuth, async (req: IRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(400);
    }
    const userId = req.user.id;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = 10;

    const communityMembers = await Member.find({ user: userId })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const total = await Member.countDocuments({ user: userId });
    const totalPages = Math.ceil(total / pageSize);

    const data = await Promise.all(
      communityMembers.map(async (member: MemberType) => {
        const community = await Community.findOne({ id: member.community });
        const owner = await User.findOne({ id: community?.owner });

        return {
          id: community?.id,
          name: community?.name,
          slug: community?.slug,
          owner: {
            id: owner?.id,
            name: owner?.name,
          },
          created_at: community?.createdAt,
          updated_at: community?.updatedAt,
        };
      })
    );

    const responseData = {
      status: true,
      content: {
        meta: {
          total,
          pages: totalPages,
          page,
        },
        data,
      },
    };

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: "Internal Server Error" });
  }
});

export default router;

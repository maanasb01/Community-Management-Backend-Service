import { Router, Response, Request, Express } from "express";
import { body} from "express-validator";
import { Snowflake } from "@theinternetfolks/snowflake";
import { tokenAuth } from "../middlewares/tokenAuth";
import { IRequest } from "../types";
import { Role } from "../models/Role";

const router = Router();

//Create a Role. POST /v1/role
router.post(
  "/",
  tokenAuth,
  [
    body("name")
      .exists()
      .trim()
      .isLength({ min: 2 })
      .withMessage("Role Name should be more than 2 characters"),
  ],
  async (req: IRequest, res: Response) => {
    if (req.body.name !== "Community Admin" && req.body.name !== "Community Member" && req.body.name !== "Community Moderator"){
        return res.status(406).json({status:false,message:"Invalid Role Name"});
    }
    try {
        const role = await Role.findOne({name:req.body.name});
        if(role){
            console.log(role)
            return res.status(409).json({status:false,message:"Role Already Exists"})
        }
        const newRole = await Role.create({
            id: Snowflake.generate(),
            name: req.body.name 
        })
        const content = {
            data: {
                id:newRole.id,
                name:newRole.name,
                created_at:newRole.createdAt,
                updated_at:newRole.updatedAt
            }
        }
        res.status(201).json({status:true,content});

        
    } catch (error:any) {
        res.status(500).json({message:error.message});
    }
  }
);

//Get all Roles. GET:v1/role
router.get("/",tokenAuth,async(req,res)=>{

    try {
        const page = parseInt(req.query.page as string) || 1;
        const perPage = 10;
    
        const total = await Role.countDocuments();
        const totalPages = Math.ceil(total / perPage);
    
        const data = await Role.find()
          .skip((page - 1) * perPage)
          .limit(perPage)
          .exec();
    
        const response = {
          status: true,
          content: {
            meta: {
              total,
              pages: totalPages,
              page,
            },
            data: data.map(item => ({
              id: item.id,
              name: item.name,
              created_at: item.createdAt,
              updated_at: item.updatedAt,
            })),
          },
        };
    
        res.json(response);
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal Server Error' });
      }

})

export default router;

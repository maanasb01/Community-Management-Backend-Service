import { Express,Request } from "express";

export interface IRequest extends Request{
    user?: {id:string}
}
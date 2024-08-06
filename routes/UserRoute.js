import express from "express";
import { 
    createUser, 
    deleteUser, 
    getUser, 
    getUserById, 
    updateUser } from "../controllers/UserController.js";

const router = express.Router();

router.get('/users', getUser)
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);


export default router;
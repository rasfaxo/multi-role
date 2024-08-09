import { request, response } from "express";
import Product from "../models/ProductModel.js";
import User from "../models/userModel.js";
import { Op } from "sequelize";

export const getProducts = async (req = request, res = response) => {
    try {
        let response;
        if(req.role === "admin"){
            response = await Product.findAll({
                attributes:['uuid', 'name', 'price'],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            })
            
        }else{
            response = await Product.findAll({
                attributes:['uuid', 'name', 'price'],
                where:{
                    userId: req.userId
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            })
        }
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getProductsById = async (req = request, res = response) => {
    try {
        const product = await Product.findOne({
            where:{
                uuid: req.params.id
            }
        })
        if(!product) return res.status(404).json({msg: "product not found"});
        
        let response;
        if(req.role === "admin"){
            response = await Product.findOne({
                attributes:['uuid', 'name', 'price'],
                where:{
                    id: product.id
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            })
            
        }else{
            response = await Product.findOne({
                attributes:['uuid', 'name', 'price'],
                where:{
                    [Op.and]:[{id: product.id}, {userId: req.userId}]
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            })
        }
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createProducts = async (req = request, res = response) => {
    const {name, price} = req.body;
    try {
        await Product.create({
            name: name,
            price: price,
            userId: req.userId,
            role:  req.role
        })
        res.status(201).json({msg: "product created successfully"})
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateProducts = (req = request, res = response) => {

}

export const deleteProducts = (req = request, res = response) => {

}
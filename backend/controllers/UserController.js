import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
    try {
        const response = await Users.findAll({
            attributes: ['id','name','email']
        })
        res.status(200).json(response)
    } catch (error) {
        console.log(error);
    }
}

export const Register = async(req, res) => {
    const {name, email, password, confPassword} = req.body
    if(password !== confPassword) return res.status(400).json({msg: 'Password and Confirm Password must be the same '})
    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(password, salt)
    try {
        await Users.create({
            name,
            email,
            password: hashPassword
        })
        res.status(200).json({msg: "Register Successfully"})
    } catch (error) {
        console.log(error);
    }
}

export const Login = async (req, res) => {
    try {
        const user = await Users.findOne({
            where: {
                email: req.body.email
            }
        })
        const match = await bcrypt.compare(req.body.password, user.password)
        if(!match) return res.status(400).json({msg: "Wrong Password"})
        const userId = user.id
        const name = user.name
        const email = user.email
        const accessToken = jwt.sign({userId, name, email}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '20s'
        })
        const refreshToken = jwt.sign({userId, name, email}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1d'
        })
        await Users.update({
            refresh_token: refreshToken
        },{
            where: {id: userId}
        })
        res.cookie('refreshToken', refreshToken,{
            httpOnly : true,
            maxAge: 24*60*60*1000
        })
        res.json({accessToken})
    } catch (error) {
        res.status(404).json({msg: "Email Not Found"})
    }
}

export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken) return res.sendStatus(401)
    const user = await Users.findOne({
        where: {refresh_token: refreshToken} 
    })
    if(!user) return res.sendStatus(403)
    const userId = user.id
    await Users.update({refresh_token: null},{
        where: {id: userId}
    })
    res.clearCookie('refreshToken')
    return res.sendStatus(200)
}
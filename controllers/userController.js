const ApiError = require('../error/ApiError');
const {User} = require('../models/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const generateJwt = function(id, email, name, role) {
    return jwt.sign(
        {id, email , name, role, registrationDate: new Date()}, 
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {
    async registration(req, res, next) {
        const { name, email, password, role, lastLoginDate} = req.body;
        if(!email || !password) {
            return next(ApiError.badRequest('Некорректный email или password'));
        }

        const candidate = await User.findOne({where: {email}});
        if(candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'));
        }
        const hashPassword = await bcrypt.hash(password, 5);
        const user = await User.create({name, email, role, password: hashPassword, registrationDate: new Date()});
        const token = generateJwt(user.id, user.email, user.role)
        user.lastLoginDate = Date.now();
        await user.save();
        return res.json({token})

    }

    async login(req, res, next) {
        const { email, password, lastLoginDate, status } = req.body;
        const user = await User.findOne({ where: { email } });
    
        if (!user) {
            return  next(ApiError.internal('Пользователь не найден'));
        }

        let comparePassword = bcrypt.compareSync(password, user.password);
        if(!comparePassword) {
            return  next(ApiError.badRequest('Неверный пароль'));
        }
        if(user.status === 'blocked') {
            return next(ApiError.badRequest('Вы заблокированы'));
        }
        const token = generateJwt(user.id, user.email, user.name);
        user.lastLoginDate = Date.now();
        await user.save();
        return res.json({token})
        
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.name, req.user.role);
        return res.json({token});
    }

    async getListUsers(req, res) {
        try {
            const users = await User.findAll();
            res.json(users);
          } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
          }
    }

    async dataUpdateId(req, res) {
        const {  status } = req.body;
        try {
            console.log(req.params.id)
            const user = await User.findByPk(req.params.id);
            if (!user) {
                console.log(req.params.id)
                return res.status(404).send('User not found');
            }
            
            user.status = status;
            await user.save();
            res.json(user);
        } catch (error) {
            console.error(error);
            console.log(req.params.id)
            res.status(500).send('Server Error');
        }
    }

    async deleteUserId(req, res) {
        try {
            const user = await User.findByPk(req.params.id);
            if (!user) {
              return res.status(404).send('User not found');
            }
            await user.destroy();
            res.send('User deleted');
        } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
        }
    }
}

module.exports = new UserController();
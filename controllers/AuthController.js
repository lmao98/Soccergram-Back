const { User } = require('../models')
const middleware = require('../middleware')


const Login = async (req, res) => {
    try {
        const user = await User.findOne({
            where: { email: req.body.email },
            raw: true
        })
        if (
            user &&
            (await middleware.comparePassword(user.password, req.body.password))
        ) {
            let payload = {
                id: user.id,
                email: user.email
            }
            let token = middleware.createToken(payload)
            return res.send({ user: payload, token })
        }
        res.status(401).send({ status: 'Error', msg: 'Unauthorized' })
    } catch (error) {
        throw error
    }
}

const Register = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body
        let passwordDigest = await middleware.hashPassword(password)
        const user = await User.create({ email, password: passwordDigest, firstName, lastName })
        res.send(user)
    } catch (error) {
        throw error
    }
}

const UpdatePassword = async (req, res) => {
    try {
        console.log('update password')
        const { oldPassword, newPassword } = req.body
        const user = await User.findByPk(req.params.user_id)
        console.log(user)
        console.log(req.params)
        if (
            user &&
            (await middleware.comparePassword(
                user.dataValues.password,
                oldPassword
            ))
        ) {
            let passwordDigest = await middleware.hashPassword(newPassword)
            await user.update({ passwordDigest })
            return res.send({ status: 'Ok', payload: user })
        }
        res.status(401).send({ status: 'Error', msg: 'Unauthorized' })
        console.log('error')
    } catch (error) { }
}

const DeleteProfile = async (req, res) => {
    try {
        const postgres = require('pg');
        const conString = 'postgres://user:pass@localhost/mydb';
        postgres.connect(conString, function (err, client, done) {
            if (err) return callback(err);
            const query = 'DELETE FROM users WHERE id = $1';
            client.query(query, [id], function (err) {
                done();
                return callback(err);
            })
        })
    } catch (error) {
        throw error
    }
}

const CheckSession = async (req, res) => {
    const { payload } = res.locals
    res.send(payload)
}


module.exports = {
    Login,
    Register,
    UpdatePassword,
    CheckSession,
    DeleteProfile
}
let express = require('express'),
    router = express.Router(),
    Users = require('../db').Users,
    app = require('../app');

// registration new user and return new token
router.post('/register', function (req, res) {
    let user = req.body;

    if (!user.email) {
        console.error('without email!');
        res.sendStatus(400);
    } else if (!user.password) {
        console.error('without password!');
        res.sendStatus(400);
    } else {
        let userForRecord = new Users({
            email: user.email,
            name: user.name
        });
        let token = userForRecord.generateToken();
        userForRecord.password = user.password;
        userForRecord.tokens.push(token);

        userForRecord.save().then(() => {
            res.status(201).send({token: token});
        }).catch(err => {
            console.error(err);
            res.sendStatus(400);
        })
    }
});

//enter with login and e-mail, response new token
router.post('/login', function (req, res) {
    let requestUser = req.body;

    Users.findOne({
        'email': requestUser.email
    }).exec((err, user) => {
        if (err) return res.sendStatus(400);
        if (!user) return res.sendStatus(400);
        if (user.checkPassword(requestUser.password)) {
            let token = user.generateToken();
            Users.findByIdAndUpdate(
                user._id,
                {$push: {'tokens': token}},
                {safe: true, upsert: false},
                (err, user) => {
                    res.status(200).send({token: token});
                }
            );
        } else {
            res.sendStatus(400);
        }
    });
});

// authorization through token
router.get('/profile', function (req, res) {

    let auth = req.headers.authorization;
    if (!auth) return res.sendStatus(401);

    let regex = new RegExp(/^Bearer (\w|\d)(\w|\d){25}$/),
        isMatch = auth.search(regex);

    if (isMatch === -1) {
        return res.sendStatus(401);
    } else {
        console.log(isMatch);
        let token = auth.split('Bearer ')[1];

        Users.findOne({
            tokens: {
                $all: [token]
            }
        }).exec((err, user) => {
            if (err) return res.sendStatus(401);
            if (!user) return res.sendStatus(401);
            res.status(200).json({
                email: user.email,
                name: user.name
            });
        });
    }
});

// logout - clear array with tokens
router.get('/logout', function (req, res) {

    let auth = req.headers.authorization;
    if (!auth) return res.sendStatus(401);

    let regex = new RegExp(/^Bearer (\w|\d)(\w|\d){25}$/),
        isMatch = auth.search(regex);

    if (isMatch === -1) {
        return res.sendStatus(401);
    } else {
        let token = auth.split('Bearer ')[1];

        Users.findOne({
            tokens: {
                $all: [token]
            }
        }).exec((err, user) => {
            if (err) return res.sendStatus(401);
            if (!user) return res.sendStatus(401);

            Users.update(
                {_id: user._id},
                {$set: {tokens: []}},
                (err, affected) => {
                    if (err) return res.sendStatus(401);
                    res.sendStatus(205)
                }
            );
        });
    }
});

module.exports = router;
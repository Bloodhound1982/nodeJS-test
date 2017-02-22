let express = require('express'),
    router = express.Router(),
    Users = require('../db').Users;
app = require('../app');


router.get('/profile', function (req, res) {
    console.dir(req.headers.authorization);
    res.sendStatus(200);
});

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

router.post('/login', function (req, res) {


    res.status(200).send({token: 'this is fake token'});
});

module.exports = router;
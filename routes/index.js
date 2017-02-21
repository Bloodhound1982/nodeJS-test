let express = require('express'),
    router = express.Router(),
    Users = require('../db').Users;
app = require('../app');


router.get('/profile', function (req, res) {
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
        userForRecord.password = user.password;
        userForRecord.save().then(document => {
            //TODO replace hardcode with token
            res.status(201).send({token: 'this is fake token'});
        }).catch(err => {
            res.sendStatus(400);
        })
    }
});

router.post('/login', function (req, res) {
    res.status(200).send({token: 'this is my token'});
});

module.exports = router;
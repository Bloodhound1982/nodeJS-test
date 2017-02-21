let express = require('express'),
    router = express.Router();

router.get('/profile', function (req, res) {
    res.sendStatus(200);
});

router.post('/register', function (req, res) {
    let user = req.body;
    res.status(201).send({token: 'this is my token'});
});

router.post('/login', function (req, res) {
    res.status(200).send({token: 'this is my token'});
});

module.exports = router;
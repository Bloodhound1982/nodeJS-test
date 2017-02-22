let mongoose = require('mongoose'),
    crypto = require('crypto');

const Schema = mongoose.Schema;

let usersSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    name: {
        type: String,
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    tokens: [{
        type: String,
    }]
});

usersSchema.methods.encryptPassword = function (password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

usersSchema.methods.generateToken = function () {
    return Math.random().toString(36).substring(2, 15)
            + Math.random().toString(36).substring(2, 15);
};

usersSchema.virtual('password')
    .set(function (password) {
        this._plainPassword = password;
        this.salt = crypto.randomBytes(32).toString('base64');
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () {
        return this._plainPassword;
    });

usersSchema.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
};



let Users = mongoose.model('Users', usersSchema);

module.exports = Users;


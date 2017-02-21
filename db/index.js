let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/data');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection db error: '));
db.once('open', () => {
    console.log('connection to db is success!');
});

module.exports.mongoose = mongoose;
module.exports.Users = require('./schemas/Users');
const http = require('http');
const express = require('express');
const logger = require('morgan');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const cors =  require('cors');
// Connect to database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/test', {
    options: {
        db: {
            safe: true
        }
    }
});
mongoose.connection.on('error', function(err) {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
});

const app = express();
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logger('tiny'))

const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('connected');
    require('./mqtt/index').register(socket);
});

io.on('disconnect', function() {
    console.log('socket disconnect');
});

app.get('/v1', (req, res) => {
    res.json('api v1');
    
}); 

app.use('/device', require('./routes/device'));
app.use('/data', require('./routes/data'));

server.listen(3000, () => {
    console.log('server started on port 3000');
});
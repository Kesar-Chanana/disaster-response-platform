const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
const { disastersRouter } = require('./routes/disasters');
const { reportsRouter } = require('./routes/reports');
const { geocodeRouter } = require('./routes/geocode');
const { socialMediaRouter } = require('./routes/socialMedia');
const { resourceRouter } = require('./routes/resources');
const { updatesRouter } = require('./routes/updates');

const { verifyImageRouter } = require('./routes/verify');
app.use('/disasters', verifyImageRouter);

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
app.use('/disasters', resourceRouter);
app.use(cors());
app.use(bodyParser.json());
app.use('/disasters', updatesRouter);

app.use('/disasters', disastersRouter(io));
app.use('/reports', reportsRouter(io));
app.use('/geocode', geocodeRouter);
app.use('/verify-image', verifyImageRouter);
app.use('/social-media', socialMediaRouter(io));

app.get('/', (req, res) => res.send('Disaster Response API Running'));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

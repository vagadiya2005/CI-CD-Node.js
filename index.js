const express = require('express');
const client = require('prom-client');

const port = 5000;

const app = express();
const register = new client.Registry();


const httpRequestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'endpoint', 'status_code'],
});

register.registerMetric(httpRequestCounter);

client.collectDefaultMetrics({ register });


app.use((req, res, next) => {
    res.on('finish', () => {
        httpRequestCounter.inc({
            method: req.method,
            endpoint: req.path,
            status_code: res.statusCode,
        });
    });
    next();
});


app.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.end(await register.metrics());
});

app.get('/', (req, res) => {

    res.send('Welcome to home page');
});

app.get('/about', (req, res) => {

    res.send('Welcome to about page');
});

app.get('/other', (req, res) => {

    res.send('Welcome to other page');
});

app.get('/contact', (req, res) => {

    res.send('Welcome to contact page');
});




app.listen(port, () => {
    console.log(`app is running on port number ${port}`);

})
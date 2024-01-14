const helmet = require('helmet');
const express = require('express');
const app = express();
const morgan = require('morgan');

const bmiRoutes = require('./routes/bmiRoutes');

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://code.jquery.com", "https://cdnjs.cloudflare.com", "https://stackpath.bootstrapcdn.com"],
            styleSrc: ["'self'", "https://stackpath.bootstrapcdn.com"],
        },
    },
}));

app.use(morgan('tiny'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use(bmiRoutes);

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

let bmiHistory = [];

router.get('/result', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'result.html'));
});


router.post('/bmicalculator', (req, res) => {
    const weight = parseFloat(req.body.weight);
    const height = parseFloat(req.body.height);
    const unit = req.body.unit;


    let bmi;
    if (unit === 'Metric') {
        bmi = weight / (height / 100) ** 2;
    } else {
        bmi = (weight / 2.205) / ((height / 39.37) ** 2);
    }


    let category;
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 24.9) category = 'Normal weight';
    else if (bmi < 29.9) category = 'Overweight';
    else category = 'Obesity';

    bmiHistory.push({
        date: new Date().toLocaleString(),
        weight: weight,
        height: height,
        bmi: bmi,
        category: category
    });


    const resultFilePath = path.join(__dirname, '..', 'views', 'result.html');
    fs.readFile(resultFilePath, 'utf8', (err, resultHtml) => {
        if (err) {
            console.error('Error reading result.html:', err);
            res.status(500).send('Internal Server Error');
        } else {

            const updatedHtml = resultHtml.replace('<div id="result-container"></div>', `
                    <div class="card">
                        <div class="card-header">
                            <h2 class="card-title">BMI Result</h2>
                        </div>
                        <div class="card-body">
                            <h3 class="card-text">Your BMI is <strong>${bmi.toFixed(2)}</strong> (${category}).</h3>
                            <p class="card-text">
                            </p>
                            <a href="/" class="btn btn-primary">Calculate Again</a>
                        </div>
                    </div>
            `);


            res.send(updatedHtml);
        }
    });
});


router.get('/history', (req, res) => {
    const historyFilePath = path.join(__dirname, '..', 'views', 'history.html');
    fs.readFile(historyFilePath, 'utf8', (err, resultHtml) => {
        if (bmiHistory.length === 0) {
            if (err) {
                console.error('Error reading result.html:', err);
                res.status(500).send('Internal Server Error');
            } else {

                const updatedHtml = resultHtml.replace('<div id="history-container"></div>', `
                    <div class="card">
                        <div class="card-header">
                            <h2 class="card-title">BMI Calculation History</h2>
                        </div>
                        <div class="card-body">
                            <p>No BMI calculations have been performed yet.</p>
                            <a href="/" class="btn btn-primary">Calculate Again</a>
                        </div>
                    </div>
            `);


                res.send(updatedHtml);
            }
        } else {
            if (err) {
                console.error('Error reading result.html:', err);
                res.status(500).send('Internal Server Error');
            } else {
                let historyHtml = ``;
                bmiHistory.forEach(entry => {
                    historyHtml += `<p>${entry.date}: ${entry.weight}kg, ${entry.height}cm - BMI: ${entry.bmi.toFixed(2)} (${entry.category})</p>`;
                });
                const updatedHtml = resultHtml.replace('<div id="history-container"></div>', `
                    <div class="card">
                        <div class="card-header">
                            <h2 class="card-title">BMI Calculation History</h2>
                        </div>
                        <div class="card-body">
                            ${historyHtml}
                            <a href="/" class="btn btn-primary">Calculate Again</a>
                        </div>
                    </div>
            `);


                res.send(updatedHtml);
            }
        }
    });
});


module.exports = router;

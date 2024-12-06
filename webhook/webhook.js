const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();
const PORT = 3000; // Change to the port you want

app.use(bodyParser.json());

app.post('/github-webhook', (req, res) => {
    const payload = req.body;
    if (payload.ref === 'refs/heads/main') { // Change branch if needed
        console.log('Push event received. Pulling changes...');
        exec('cd /path/to/your-repo && git pull && npm install && pm2 restart ecosystem.config.js', (err, stdout, stderr) => {
            if (err) {
                console.error(`Error: ${err.message}`);
                return res.status(500).send('Something went wrong.');
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
            return res.status(200).send('Update complete.');
        });
    } else {
        return res.status(200).send('Not the main branch. Ignoring.');
    }
});

app.listen(PORT, () => {
    console.log(`Webhook listener running on port ${PORT}`);
});

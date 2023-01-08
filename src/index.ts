import 'dotenv/config';
import http from "http"

const port = process.env.PORT || 4000;

const app = http.createServer()

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})

module.exports = app;


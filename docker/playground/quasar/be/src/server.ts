import * as express from "express";
import { upsert } from './controllers/test';

const app = express();
const port = 3000;

app.get('/', upsert);

app.listen(port, () => {
    console.log('running on port: ' + port);
})
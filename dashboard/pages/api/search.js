import axios from "axios";

export default async function handler(req, res) {
    try {
        const {body} = req;
        const response = await axios.post('http://localhost:8080/events/search', body);
        res.send(response.data);
    } catch (e) {
        console.error(e);
        res.status(500).end();
    }
}
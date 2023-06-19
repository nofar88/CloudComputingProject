import axios from "axios";

export default async function handler(req, res) {
  try {
    const response = await axios.get('http://localhost:8080/events/last');
    res.send(response.data);
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
}

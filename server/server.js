// server start
import app from "./app.js";

const port = 3000;

app.listen(port, "0.0.0.0", (err) => {
  if (err) {
    throw err;
  }
  console.log(`Server live at http://localhost:${port}`);
});
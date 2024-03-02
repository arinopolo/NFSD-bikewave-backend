const app = require("./app");
require("./socket/index");
const port = process.env.PORT;

app.listen(port || `0.0.0.0:$PORT`, () => {
  console.log("Servidor funcionando.");
});

import express from "express";
import ProductRouter from "./router/product.routes.js";
import CartRouter from "./router/carts.routes.js";
import { engine } from "express-handlebars";
import * as path from "path";
import __dirname from "./utils.js";
import ProductManager from "./controllers/ProductManager.js";

const app = express();
const PORT = 8080;
const product = new ProductManager();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//Handlebars
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))

//Static

app.use("/", express.static(__dirname + "/public"))

app.get("/:id", async (req, res) => {
    let prod = await product.getProductsById(req.params.id)
    res.render("prod", {
        title: "Express Avanzado | Handlebars",
        products : prod

    })
})

app.use("/api/products", ProductRouter);
app.use("/api/cart", CartRouter);



app.listen(PORT, () => {
    console.log(`Servidor ${PORT} Arriba`);
});


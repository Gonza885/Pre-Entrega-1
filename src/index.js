import express from "express";
import ProductRouter from "./router/product.routes.js";
import CartRouter from "./router/carts.routes.js";
import * as path from "path";
import __dirname from "./utils.js";
import ProductManager from "./controllers/ProductManager.js";
import { engine } from "express-handlebars";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);
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

app.get("/", async (req, res) => {
    let allProducts = await product.getProducts();
    res.render("home", {
        title: "Express Avanzado",
        products: allProducts,
    });
});

app.get("/realtimeproducts", async (req, res) => {
    let allProducts = await product.getProducts();
    res.render("realTimeProducts", {
        title: "Real Time Products",
        products: allProducts,
    });
});

io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");

    // Evento para agregar un nuevo producto
    socket.on("newProduct", async (productData) => {
        await product.addProducts(productData);
        const allProducts = await product.getProducts();
        io.emit("updateProducts", allProducts);
    });
});

app.use("/api/products", ProductRouter);
app.use("/api/cart", CartRouter);



server.listen(PORT, () => {
    console.log(`Servidor ${PORT} Arriba`);
});


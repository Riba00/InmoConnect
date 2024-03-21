import express from "express";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import propertiesRoutes from "./routes/propertiesRoutes.js";
import db from "./config/db.js";

// Create app
const app = express();

// Enable data reading on forms
app.use(express.urlencoded({ extended: true }));

// Enable Cookie Parser
app.use(cookieParser());

// Enable CSRF
app.use(csrf({ cookie: true }));

// DB Connection
const retries = 10;
for (let attempt = 1; attempt <= retries; attempt++) {
  try {
    await db.authenticate();
    await db.sync();
    console.log("Connection correct");
    break;
  } catch (error) {
    console.log(`Connection attempt ${attempt} failed.`, error);
    if (attempt < retries) {
      console.log(`Waiting ${delay / 1000} seconds before retrying...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// Habilite Pug
app.set("view engine", "pug");
app.set("views", "./views");

// Public Folder
app.use(express.static("public"));

// Routing
app.use("/auth", userRouter);
app.use("/", propertiesRoutes);

// Define port and run project
const port = process.env.APP_PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on ${port}`);
});

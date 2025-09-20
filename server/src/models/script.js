const mongoose = require('mongoose');
const Product = require('./Product');

const MONGO_URI = "mongodb+srv://jeevandasjdev:j787d2004@cluster0.ax1qq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // change to your DB

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

mongoose.connection.once("open", async () => {
  console.log("Connected to MongoDB");

  const products = await Product.find({});

  for (const product of products) {
    // Ingredients
    if (product.availableIngredients) {
      product.availableIngredients = product.availableIngredients.map((item) => {
        if (typeof item === "string") return { name: item, description: "" };
        if (item.name) return item; // already correct
        return { name: Object.values(item).join(""), description: "" }; // fix old char-split objects
      });
    }

    // Processes
    if (product.availableProcesses) {
      product.availableProcesses = product.availableProcesses.map((item) => {
        if (typeof item === "string") return { name: item, description: "" };
        if (item.name) return item;
        return { name: Object.values(item).join(""), description: "" };
      });
    }

    // Equipment
    if (product.availableEquipment) {
      product.availableEquipment = product.availableEquipment.map((item) => {
        if (typeof item === "string") return { name: item, description: "" };
        if (item.name) return item;
        return { name: Object.values(item).join(""), description: "" };
      });
    }

    await product.save();
  }

  console.log("Migration completed successfully!");
  process.exit(0);
});

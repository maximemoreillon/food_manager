import mongoose, { Schema } from "mongoose";
import "dotenv/config";

const { MONGODB_URI = "mongodb://localhost/food-manager" } = process.env;
mongoose.connect(MONGODB_URI);

export const foodSchema = new Schema({
  name: String,
  vendor: String,
  barcode: String,

  user_id: String,
  hidden: Boolean,

  image: String, // Name of the image file

  serving: {
    size: { type: Number, default: 0 },
    unit: { type: String, default: "g" },
    calories: { type: Number, default: 0 },
    price: Number,

    macronutrients: {
      protein: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
      carbohydrates: { type: Number, default: 0 },
    },
  },
});

const Food = mongoose.model("Food", foodSchema);

Food.find({}).then(async (foods) => {
  for (const { _id, vendor, name } of foods) {
    if (vendor) {
      const newName = `${vendor} ${name}`;
      await Food.findOneAndUpdate(_id, { name: newName, vendor: null });
      console.log(`Updated ${newName}`);
    } else {
      console.log(`${name} has no vendor, skipping...`);
    }
  }
});

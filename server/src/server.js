import "./config/env.js"; // 🔥 loads env FIRST, before everything

import app from "./app.js";
import connectDB from "./config/db.js";
import aiRoutes from "./routes/aiRoutes.js";

connectDB();

app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//Always restart the dev server (CTRL + C then npm run dev) after changing anything in your Mongoose schemas.

import { Schema, model, models} from "mongoose";

const VerificationCodeSchema = new Schema({
  email: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
},{
  // Disable auto-indexing if you're handling it manually
  autoIndex: false 
});

VerificationCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const VerificationCode = models.VerificationCode || model("VerificationCode", VerificationCodeSchema)

export default VerificationCode
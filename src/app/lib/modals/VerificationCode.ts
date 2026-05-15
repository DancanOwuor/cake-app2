import { Schema, model, models } from "mongoose";

const VerificationCodeSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

// TTL index (OK but see note below)
VerificationCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const VerificationCode =
  models.VerificationCode ||
  model("VerificationCode", VerificationCodeSchema);

export default VerificationCode;
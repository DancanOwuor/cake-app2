// models/Order.ts
//Always restart the dev server (CTRL + C then npm run dev) after changing anything in your Mongoose schemas.

import { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema({ 
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,
    }
  ],
  total: Number,
},
{
        timestamps: true
    }
);

// reuse if already defined
export default models?.Order || model('Order', OrderSchema);

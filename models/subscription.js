import { Schema, model, models } from 'mongoose';

const subscriptionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  endpoint: String,
  keys: {
    p256dh: String,
    auth: String
  }
});

const Subscription = models.Subscription || model('Subscription', subscriptionSchema);

export default Subscription;
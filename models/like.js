import { Schema, model, models } from 'mongoose';

const LikeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Prompt',
    required: true,
  },
}, {
  timestamps: true,
});

const Like = models.Like || model('Like', LikeSchema);

export default Like;

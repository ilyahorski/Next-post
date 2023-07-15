import { Schema, model, models } from 'mongoose';

const CommentSchema = new Schema({
  commentatorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  comment: {
    type: String,
  },
}, {
  timestamps: true,
});

const Comment = models.Comment || model('Comment', CommentSchema);

export default Comment;
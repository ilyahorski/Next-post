import { Schema, model, models } from 'mongoose';

const MessageSchema = new Schema({
  writerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  chatId: {
    type: Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
  },
  message: {
    type: String,
  },
  media: {
    type: [String],
    default: []
  },
  messageStatus: {
    type: String,
    enum: ['sent', 'delivered', 'seen'],
    default: 'sent'
  },
  deletedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  replyTo: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },
  reactions: [{
    emoji: String,
    users: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    default: []
  }]
}, {
  timestamps: true,
});

const Message = models.Message || model('Message', MessageSchema);

export default Message;
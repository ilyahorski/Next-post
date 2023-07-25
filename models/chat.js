import { Schema, model, models } from 'mongoose';

const ChatSchema = new Schema({
  creatorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  membersList: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  chatName: {
    type: String,
  },
  lastMessage: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
  },
  secretToken: {
    type: String,
  },
}, {
  timestamps: true,
});

const Chat = models.Chat || model('Chat', ChatSchema);

export default Chat;
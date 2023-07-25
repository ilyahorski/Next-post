import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  email: {
    type: String,
    unique: [true, 'Email already exists!'],
    required: [true, 'Email is required!'],
  },
  username: {
    type: String,
    required: [true, 'Username is required!'],
  },
  image: {
    type: String,
  },
  userImage: {
    type: String,
  },
  session: {
    type: String,
  },
  socketId: {
    type: [String],
  },
  status: {
    type: String,
    enum: ['online', 'offline'],
    default: 'offline'
  },
  blockedUsers: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
});

const User = models.User || model('User', UserSchema);

export default User;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema(
  {
    name: {
      type: String,
      minlength: [2, 'Name must have at least 2 characters']
      // default: ""
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, 'Email is required.'],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: { type: String, required: [true, 'Password is required.'] },
    dashboards: [{ type: Schema.Types.ObjectId, ref: 'Dashboard' }],
  },
  { timestamps: true }
);

UserSchema.pre('save', function(next) {
  const user = this;
  const salt = bcrypt.genSaltSync(10);
  user.password = bcrypt.hashSync(user.password, salt);
  next();
});

UserSchema.methods.isSamePassword = function(requestedPassword) {
  return bcrypt.compareSync(requestedPassword, this.password);
};

mongoose.model('User', UserSchema);

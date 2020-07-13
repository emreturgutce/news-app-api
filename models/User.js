const mongoose = require("mongoose"),
  bcrypt = require("bcryptjs"),
  validator = require("validator"),
  jwt = require("jsonwebtoken"),
  Favorites = require("./Favorites");

const trimRequiredUniqueString = {
  type: String,
  required: true,
  unique: true,
  trim: true,
};

const userSchema = new mongoose.Schema(
  {
    username: { ...trimRequiredUniqueString, minlength: 6 },
    email: {
      ...trimRequiredUniqueString,
      validate() {
        if (!validator.isEmail(this.email))
          throw new Error("Email is not valid");
      },
    },
    password: { ...trimRequiredUniqueString, minlength: 6 },
    avatar: {
      type: Buffer,
    },
    tokens: [
      {
        token: String,
      },
    ],
    favoritesId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET);
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User does not exist");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Unable to login");
  return user;
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password"))
    this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.pre("deleteOne", async function (next) {
  await Favorites.deleteOne({ userId: this._id });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;

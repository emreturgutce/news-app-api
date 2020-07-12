const mongoose = require("mongoose"),
  bcrypt = require("bcryptjs"),
  validator = require("validator"),
  jwt = require("jsonwebtoken"),
  Favorites = require("./Favorites");

const requiredString = {
  type: String,
  required: true,
};

const trimRequiredUniqueString = {
  ...requiredString,
  unique: true,
  trim: true,
};

const userSchema = new mongoose.Schema(
  {
    username: trimRequiredUniqueString,
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
        token: requiredString,
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

userSchema.pre("save", async function (next) {
  if (this.isModified("password"))
    this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.pre("deleteOne", async function (next) {
  await Favorites.deleteOne({ userId: this._id });
  next();
});

module.exports = mongoose.model("User", userSchema);

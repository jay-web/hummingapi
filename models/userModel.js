const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please mention your name"],
      min: 3,
    },
    username: {
      type: String,
      required: [true, "Please mention username"],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is mandatory"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter valid email"],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please re-enter your password"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Password are not same !!!",
      },
      select:false
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetTokenExpires: {
      type: Date,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    photo: {
      type: [String],
      default: "default.jpg",
    },
    likes:[{
      type: mongoose.Schema.ObjectId,
      ref: "Post"
    }]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


// Middleware to encypt the password of the user before saving to DB

userSchema.pre("save", async function(next){
  if(!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});


// Instance middleware to access in entire document
// To compare the user entered password with saved password in database

userSchema.methods.correctPassword = async function(enteredPassword, candidatePassword ){
  return bcrypt.compare(enteredPassword, candidatePassword);
}

// To check whether user changed the password after login or not

userSchema.methods.isPasswordChanged = async function(JWTTimeStamp) {
  if(this.passwordChangedAt){
    let passwordChanged = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

    return JWTTimeStamp < passwordChanged     // return true means password changed
  }
  return false;   // means password don't get changed
}



const USER = mongoose.model("User", userSchema);

module.exports = USER;

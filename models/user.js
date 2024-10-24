// src/models/User.ts

import mongoose, { Document, Model, Schema } from 'mongoose';



const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    displayName: String,
    avatar: String,
    phoneNumber: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'moderator'],
      default: 'user',
    },
    questions: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },
        link: {
          type: String,
          required: true,
          trim: true,
          validate: {
            validator(v) {
              // Basic URL validation
              return /^(http|https):\/\/[^ "]+$/.test(v);
            },
            message: props => `${props.value} is not a valid URL!`,
          },
        },
        tag: {
          type: String,
          required: true,
          enum: ['beginner', 'intermediate', 'advanced'],
          lowercase: true,
        },
      },
    ],
    credit: {
      total: {
        type: String,
        default: 5
        // },
        // used : {
        //   type : String,
        //   default : 0
        // }
      }
    },{
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);


userSchema.methods.getFullName = function () {
  return `${this.firstName} ${this.lastName}`;
};

userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email });
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
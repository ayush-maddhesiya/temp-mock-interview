import { meet } from 'googleapis/build/src/apis/meet';
import mongoose from 'mongoose';
import { type } from 'os';

const userSchema = new mongoose.Schema(
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
      //validotr for password
      validate: {
        validator: function(v) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
            v
          );
        },
        message: props => `${props.value} is not a valid password!`,
      },
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
            validator: function(v) {
              return /^(http|https):\/\/[^ "]+$/.test(v);
            },
            message: props => `${props.value} is not a valid URL!`,
          },
        },
        tag: {
          type: String,
          trim: true,
          required: true,
          enum: ['beginner', 'intermediate', 'advanced'],
          lowercase: true,
        },
        meetStatus: {
          type: String,
          trim: true,
          enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
          default: 'scheduled'
        }
      },
    ],
    credit: {
      total: {
        type: Number,
        default: 5
      },
      used: {
        type: Number,
        default: 0
      }
    },
    meetLink: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return /^(http|https):\/\/[^ "]+$/.test(v);
        },
        message: props => `${props.value} is not a valid URL!`,
      },
    },
    start_time: [{
      type: Date,
      required: false,
      trim: true,
      unique: true,
      validate: {
          validator: function(v) {
              // Check if start_time is a multiple of 60 minutes
              return v.getMinutes() === 0 && v.getSeconds() === 0;
          },
          message: props => `${props.value} is not a valid start time! Must be at the start of the hour.`
      }
  }],
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

// Instance method to get full name
userSchema.methods.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

// Static method to find user by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

CallSessionSchema.pre('save', async function(next) {
  const existingSessions = await CallSession.find({
      $or: [
          { caller: this.caller, start_time: this.start_time },
          { receiver: this.receiver, start_time: this.start_time }
      ]
  });

  if (existingSessions.length > 0) {
      return next(new Error('This user already has a call scheduled at this time.'));
  }

  next();
});


// Check if the model exists before creating a new one
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
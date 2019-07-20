const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WidgetSchema = new Schema(
  {
    template: {
      name: {
        type: String,
        required: 'Name is required'
      },
      sysName: {
        type: String,
        required: 'System Name is required'
      }
    },
    settings: {
      url: {
        type: String
      },
      text: {
        type: String
      },
      frequency: {
        type: Number
      }
    },
    result: {
      date: {
        type: Date
      },
      status: {
        type: Number
      },
      expirationDate: {
          type: Date
      }
    },
    update: {
      type: Date,
      default: Date.now
    },
    dashboard: { type: Schema.Types.ObjectId, ref: 'Dashboard' },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

mongoose.model('Widget', WidgetSchema);

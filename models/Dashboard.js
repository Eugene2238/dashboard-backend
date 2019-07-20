const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DashboardSchema = new Schema(
    {
        title: {
            type: String,
            minlength: [2, 'Title must have at least 2 characters']
        },
        description: {
            type: String,
            default: ""
        },
        widgets: [{ type: Schema.Types.ObjectId, ref: 'Widget' }],
        user: {type: Schema.Types.ObjectId, ref: 'User'},
    },
    { timestamps: true }
);

mongoose.model('Dashboard', DashboardSchema);

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    id:{
        type: String,
        required: true,
        unique: true
    },
    title: { 
        type: String, 
        required: true 
    },
    description: {
        type: String, 
        required: false
    },
    status: { 
        type: String, 
        enum: ['pending', 'in_progress', 'completed'], 
        default: 'pending' 
    },
    task_date:{
        type: Date,
        required: false,
    },
    dueDate: {
        type: Date,
        required: false,
    },
    category_id: { 
        type: String, 
        required: false, 
    },
    userId:{
        type: String,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
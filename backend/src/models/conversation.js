import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
},
    {
        _id: false // Prevents creation of an _id field for subdocuments
    }

);

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',

    },

},
    {
        _id: false // Prevents creation of an _id field for subdocuments
    }
);

const lastMessageSchema = new mongoose.Schema({
    _id: { type: String },
    content: {
        type: String,
        default: null
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    createdAt: {
        type: Date,
        default: null
    }
},
    {
        _id: false // Prevents creation of an _id field for subdocuments
    }
);

const conversationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['private', 'group'],
        required: true
    },
    participants: {
        type: [participantSchema],
        required: true
    },
    group: {
        type: groupSchema,
    },
    lastMessageAt: {
        type: Date,
    },
    seenBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    lastMessage: {
        type: lastMessageSchema,
        default: null
    },
    unreadCounts: {
        type: Map,
        of: Number,
        default: {}
    }
},
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

conversationSchema.index({
    "participants.userId": 1,
    lastMessageAt: -1,
}); // Index for efficient retrieval of conversations by last message time

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;
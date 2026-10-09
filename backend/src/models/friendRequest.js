import mongoose from 'mongoose';

const friendRequestSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        maxlength: 200,
    },
},
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

friendRequestSchema.index({ from: 1, to: 1 }, { unique: true }); // Ensure unique friend requests between users

friendRequestSchema.index({ from: 1 });
friendRequestSchema.index({ to: 1 });

const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);
export default FriendRequest;
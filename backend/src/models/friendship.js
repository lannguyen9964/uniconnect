import mongoose from 'mongoose';

const friendshipSchema = new mongoose.Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

friendshipSchema.pre('save', function () {
    const id1 = this.user1.toString();
    const id2 = this.user2.toString();

    if (id1 > id2) {
        this.user1 = new mongoose.Types.ObjectId(id2);
        this.user2 = new mongoose.Types.ObjectId(id1);
    }
});

friendshipSchema.index({ user1: 1, user2: 1 }, { unique: true }); // Ensure unique friendship pairs

const Friendship = mongoose.model('Friendship', friendshipSchema);
export default Friendship;


import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    displayName: {
        type: String,
        required: true,
        trim: true,
    },
    profilePictureUrl: {
        type: String, // CDN link for profile picture 
    },
    profilePictureId: {
        type: String, // Cloudinary public ID for profile picture
    },
    bio: {
        type: String,
        maxlength: 200, // Limit bio to 200 characters
    },
    phoneNumber: {
        type: String,
        sparse: true, // Optional field for phone number, but must be unique if provided
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
},
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

const User = mongoose.model("User", userSchema);
export default User;

import User from '../models/user.js';
import Friend from '../models/friendship.js';
import FriendRequest from '../models/friendRequest.js';


export const sendFriendRequest = async (req, res) => {
    try {
        const { to, message } = req.body;
        const from = req.user._id;

        if (from === to) {
            return res.status(400).json({ message: "Cannot send friend request to self" });
        }

        const userExist = await User.exists({ _id: to });

        if (!userExist) {
            return res.status(400).json({ message: "User does not exist" })
        }

        let user1 = from.toString();
        let user2 = to.toString();

        if (user1 > user2) {
            [user1, user2] = [user2, user1]
        }

        const [alreadyFriends, existingFriendRequest] = await Promise.all([
            Friend.findOne({ user1, user2 }),
            FriendRequest.findOne({
                $or: [
                    { from, to },
                    { from: to, to: from }
                ]
            })
        ])

        if (alreadyFriends) {
            return res.status(400).json({ message: "Already been friends" })
        }

        if (existingFriendRequest) {
            return res.status(400).json({ message: "Friend request has already been sent" })
        }

        const request = await FriendRequest.create({
            from,
            to,
            message,
        });

        return res.status(201).json({ message: "Friend request successfully sent", request })


    } catch (error) {
        console.error("Error sending friend request:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }

}

export const acceptFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user._id;

        const request = await FriendRequest.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: "Friend request not found" })
        }

        if (request.to.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Not authorized to accept friend request" })
        }

        const friend = await Friend.create({
            user1: request.from,
            user2: request.to
        })

        await FriendRequest.findByIdAndDelete(requestId);
        const from = await User.findById(request.from).select("_id displayName profilePictureUrl").lean();

        return res.status(200).json({
            message: "Accepted friend request",
            newFriend: {
                _id: from?._id,
                displayName: from?.displayName,
                profilePictureUrl: from?.profilePictureUrl,
            },

        });

    } catch (error) {
        console.error("Error accepting friend request:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const rejectFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user._id;

        const request = await FriendRequest.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        if (request.to.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Not authorized to reject friend request" })
        }

        await FriendRequest.findByIdAndDelete(requestId);

        return res.sendStatus(204);

    } catch (error) {
        console.error("Error rejecting friend request:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllFriends = async (req, res) => {
    try {
        const userId = req.user._id;

        const friendships = await Friend.find({
            $or: [{
                user1: userId
            }, {
                user2: userId
            }]
        }).populate("user1", "_id displayName profilePictureUrl")
            .populate("user2", "_id displayName profilePictureUrl")
            .lean();

        if (!friendships) {
            return res.status(200).json({ friends: [] })
        }

        const friends = friendships.map((f) => f.user1._id.toString() === userId.toString() ? f.user2 : f.user1)

        return res.status(200).json({ friends });

    } catch (error) {
        console.error("Error retrieving friends:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getFriendRequests = async (req, res) => {
    try {
        const userId = req.user._id;

        const populateFields = "_id username displayName profilePictureUrl";

        const [sent, received] = await Promise.all([
            FriendRequest.find({ from: userId }).populate("to", populateFields),
            FriendRequest.find({ to: userId }).populate("from", populateFields)
        ])

        return res.status(200).json({ sent, received });
    } catch (error) {
        console.error("Error retrieving friend requests:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
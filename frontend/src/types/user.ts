export interface User {
    _id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    displayName: string;
    profilePictureUrl?: string;
    profilePictureId?: string;
    bio?: string;
    phoneNumber?: string;
    createdAt?: string;
    updatedAt?: string;
}

/** GET /friends populates only these fields */
export interface Friend {
    _id: string;
    username?: string;
    displayName: string;
    profilePictureUrl?: string | null;
}

export interface FriendsResponse {
    friends: Friend[];
}

export interface FriendRequestsResponse {
    sent: FriendRequest[];
    received: FriendRequest[];
}

export interface FriendRequest {
    _id: string;
    from?: {
        _id: string;
        username: string;
        displayName: string;
        profilePictureUrl?: string | null;
    };
    to?: {
        _id: string;
        username: string;
        displayName: string;
        profilePictureUrl?: string | null;
    };
    message?: string;
    createdAt: string;
    updatedAt: string;
}
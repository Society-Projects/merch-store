class UserObject {
    constructor(user) {
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.avatar = user.avatar;
        this.role = user.role;
        this.id = user._id;
    }
}

export default UserObject;
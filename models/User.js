import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatarUrl: String,
  },
  { timestamps: { createdAt: "createdDate", updatedAt: "updatedDate" } }
);

const UserModel = mongoose.model("User", UserSchema);
UserModel.createIndexes();
export default UserModel;

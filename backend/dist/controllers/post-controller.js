import Post from "../models/Post.js";
import User from "../models/User.js";
import mongoose from "mongoose";
export const getAllPosts = async (_req, res) => {
    try {
        const posts = await Post.find().populate("user", "_id name");
        res.status(200).json({ posts });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch posts" });
    }
};
export const addPost = async (req, res) => {
    const { title, description, image, location, date, user } = req.body ?? {};
    if (typeof title !== "string" ||
        title.trim() === "" ||
        typeof description !== "string" ||
        description.trim() === "" ||
        typeof image !== "string" ||
        image.trim() === "" ||
        typeof location !== "string" ||
        location.trim() === "" ||
        typeof date !== "string" ||
        date.trim() === "" ||
        typeof user !== "string" ||
        user.trim() === "") {
        res.status(422).json({ message: "Invalid data" });
        return;
    }
    let existingUser;
    try {
        existingUser = await User.findById(user);
    }
    catch (err) {
        console.log(err);
    }
    if (!existingUser) {
        return res.status(404).json({ message: "No user found" });
    }
    try {
        const post = new Post({
            title: title.trim(),
            description: description.trim(),
            image: image.trim(),
            location: location.trim(),
            date: new Date(`${date}`),
            user,
        });
        await mongoose.connection.transaction(async (session) => {
            await post.save({ session });
            await User.updateOne({ _id: existingUser._id }, { $addToSet: { posts: post._id } }, { session }).orFail();
        });
        return res.status(201).json({ post });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Unexpected error occur" });
    }
};
export const getPostById = async (req, res) => {
    const id = req.params.id;
    let post;
    try {
        post = await Post.findById(id);
    }
    catch (err) {
        console.log(err);
    }
    if (!post) {
        return res.status(404).json({ message: "No post found" });
    }
    return res.status(200).json({ post });
};
export const updatePost = async (req, res) => {
    const id = req.params.id;
    const { title, description, image, location, date } = req.body ?? {};
    if (typeof title !== "string" ||
        title.trim() === "" ||
        typeof description !== "string" ||
        description.trim() === "" ||
        typeof image !== "string" ||
        image.trim() === "" ||
        typeof location !== "string" ||
        location.trim() === "" ||
        typeof date !== "string" ||
        date.trim() === "") {
        res.status(422).json({ message: "Invalid data" });
        return;
    }
    let post;
    try {
        post = await Post.findByIdAndUpdate(id, {
            title: title.trim(),
            description: description.trim(),
            image: image.trim(),
            location: location.trim(),
            date: new Date(`${date}`),
        });
    }
    catch (err) {
        console.error("Failed to update post:", err);
        return res.status(500).json({ message: "Failed to update post" });
    }
    if (!post) {
        return res.status(404).json({ message: "No post found" });
    }
    return res.status(200).json({ message: "Updated successfully" });
};
export const deletePost = async (req, res) => {
    const id = req.params.id;
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const post = await Post.findById(id)
            .session(session)
            .populate("user");
        if (!post || !post.user) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Post or user not found" });
        }
        post.user.posts = post.user.posts.filter((id) => !id.equals(post._id));
        await post.user.save({ session });
        await Post.findByIdAndDelete(id, { session });
        await session.commitTransaction();
        return res.status(200).json({ message: "Deleted successfully" });
    }
    catch (err) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        console.log(err);
        return res.status(500).json({ message: "Unable to delete" });
    }
    finally {
        await session.endSession();
    }
};

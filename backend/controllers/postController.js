
import Post from "../models/Posts.js";


export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error: error.message });
  }
};


export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ post });
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error: error.message });
  }
};


export const createPost = async (req, res) => {
  try {
    const { postName, postCategory } = req.body;

    if (!postName || !postCategory) {
      return res.status(400).json({ message: "Post name and category are required" });
    }

    const post = await Post.create({ postName, postCategory });

    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error: error.message });
  }
};


export const updatePost = async (req, res) => {
  try {
    const { postName, postCategory } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (postName) post.postName = postName;
    if (postCategory) post.postCategory = postCategory;

    await post.save();

    res.json({ message: "Post updated successfully", post });
  } catch (error) {
    res.status(500).json({ message: "Error updating post", error: error.message });
  }
};


export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error: error.message });
  }
};

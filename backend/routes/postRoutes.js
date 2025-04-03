import express from "express";
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getPosts);
router.get("/:id", protect, getPostById);
router.post("/", protect, authorizeRoles("admin", "CEO", "ZEO"), createPost);
router.put("/:id", protect, authorizeRoles("admin", "CEO", "ZEO"), updatePost);
router.delete("/:id", protect, authorizeRoles("admin", "CEO", "ZEO"), deletePost);

export default router;

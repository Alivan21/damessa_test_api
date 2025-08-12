import { Router } from "express";

import { create, detail, list, remove, update } from "@/controllers/category.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { validate } from "@/middlewares/validation.middleware";
import { createCategorySchema, updateCategorySchema } from "@/validators/category.validator";

const router = Router();

router.get("/", authenticate, list);
router.get("/:id", authenticate, detail);
router.post("/", authenticate, validate(createCategorySchema), create);
router.put("/:id", authenticate, validate(updateCategorySchema), update);
router.delete("/:id", authenticate, remove);

export default router;



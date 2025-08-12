import { Router } from "express";

import { create, detail, list, remove, update } from "@/controllers/product.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { validate } from "@/middlewares/validation.middleware";
import { createProductSchema, updateProductSchema } from "@/validators/product.validator";

const router = Router();

router.get("/", authenticate, list);
router.get("/:id", authenticate, detail);
router.post("/", authenticate, validate(createProductSchema), create);
router.put("/:id", authenticate, validate(updateProductSchema), update);
router.delete("/:id", authenticate, remove);

export default router;

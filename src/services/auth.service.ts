import { comparePassword, hashPassword } from "@/helpers/bcrypt.helper";
import { generateToken } from "@/helpers/jwt.helper";
import { User } from "@/models/user.model";

export const registerUser = async (name: string, email: string, password: string) => {
  const hashed = await hashPassword(password);
  const user = await User.create({ name, email, password: hashed });
  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = generateToken({ id: user.id, email: user.email });
  return { user, token };
};

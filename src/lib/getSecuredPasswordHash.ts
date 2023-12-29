import bcrypt from "bcryptjs";

export default async function getSecuredPasswordHash(password: string) {
  const salt = await bcrypt.genSalt(10);
  const secPassword = await bcrypt.hash(password, salt);
  return secPassword;
}

import bcrypt from "bcrypt";

export async function compareHashPassword(
  inputPassword: string,
  dbPassword: string
): Promise<boolean> {
  return await bcrypt.compare(inputPassword, dbPassword);
};

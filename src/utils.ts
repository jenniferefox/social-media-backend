import bcrypt from "bcrypt";

export function matchUserUUID(path: string) {
  try {
    const regex = /([a-f0-9\-]{36})/;
    const match = path.match(regex);
    if (match && match[1]) {
      console.log("Extracted UUID:", match[1]);
      return match[1];
    }

  } catch (error) {
    console.log("No UUID found.")
    throw error;
  }

};

// test:
// const newPath = '/users/29b2d67a-c843-4743-863f-c756f1202aee/posts';
// console.log(matchUserUUID(newPath))


export function hashPassword(password: string) {
  return bcrypt.hash(password, 2);
};

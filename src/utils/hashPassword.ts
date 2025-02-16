import bcrypt from "bcrypt";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 2);
}

// // test:
// console.log(hashPassword("hello").then(hashedPassword => {
//   console.log('Hashed Password:', hashedPassword);
// })
// .catch(error => {
//   console.error('Error hashing password:', error);
// }));

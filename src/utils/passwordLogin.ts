import bcrypt from "bcrypt";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 2);
}

export async function compareHashPassword(
  inputPassword: string,
  dbPassword: string
): Promise<boolean> {
  return await bcrypt.compare(inputPassword, dbPassword);
};

export function addCookieOnLogin(useremail: string) {
  const currentTime = new Date();
  currentTime.setTime(currentTime.getTime() + 5 * 60 * 1000);
  // 5 min timeout
  let expires = "expires=" + currentTime.toUTCString();
  let username = "username=" + useremail;
  document.cookie = "loggedIn=true" + username + expires + ";path=/";
}

export function deleteCookieOnLogout() {
  const output = document.getElementById("cookies");
  output.textContent = "";
}

export function checkIfUserLoggedIn(userEmail: string) {
  if (
    document.cookie
      .split(";")
      .some(
        (item) =>
          item.includes("loggedIn=true") &&
          item.includes(`username=${userEmail}`)
      )
  ) {
    return true;
  }
}

// // password hash test:
// console.log(hashPassword("hello").then(hashedPassword => {
//   console.log('Hashed Password:', hashedPassword);
// })
// .catch(error => {
//   console.error('Error hashing password:', error);
// }));

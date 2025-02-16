export function checkIfUserLoggedIn(useremail: string) {
  if (
    document.cookie.split(";").some((item) => item.includes("loggedIn=true") && item.includes(`username=${useremail}`))
  ) {
    return true;
  }
};

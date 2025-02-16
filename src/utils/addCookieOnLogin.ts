export function addCookieOnLogin(useremail: string) {
  const currentTime = new Date();
  currentTime.setTime(currentTime.getTime() + 5 * 60 * 1000);
  // 5 min timeout
  let expires = "expires=" + currentTime.toUTCString();
  let username = "username=" + useremail;
  document.cookie = "loggedIn=true" + username + expires + ";path=/";
}

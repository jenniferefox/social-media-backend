import bcrypt from "bcrypt";

export async function compareHashPassword(inputPassword: string, dbPassword: string): Promise<boolean> {
  return await bcrypt.compare(inputPassword, dbPassword)
};

compareHashPassword("password", "$2b$04$049a4kxGywnWTAKeVPsa9OnMKtFydc690TdzZU/qSvkDwlixfDUt6")
  .then(hashedPassword => {
  console.log('Hashed Password:', hashedPassword);
})
.catch(error => {
  console.error('Error hashing password:', error);
});

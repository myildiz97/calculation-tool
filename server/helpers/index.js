import bcrypt from "bcrypt";

export const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      err && reject(err);
      bcrypt.hash(password, salt, (err, hash) => err ? reject(err) : resolve(hash) );
    });
  });
};

export const comparePassword = (password, hashed) => bcrypt.compare(password, hashed);
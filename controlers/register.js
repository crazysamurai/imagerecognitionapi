const handleRegister = async (req, res, bcrypt, db) => {
  const { name, email, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json("Incorrect details");
  }
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  db.transaction((trx) => {
    //transaction, details in knex docs
    trx
      .insert({
        hash: hashedPassword,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*") //return all, a feature in knex
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json("Unable to register"));
};

module.exports = {
  handleRegister: handleRegister,
};

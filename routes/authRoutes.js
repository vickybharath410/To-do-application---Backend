const authRoutes = require("express").Router();
const User = require("../model/userSchema");
authRoutes.get("/", (req, res) => {
  res.send("Authroutes working");
});
authRoutes.post("/signup", async (req, res) => {
  //   console.log(req.body);
  const existinguser = await User.findOne({ email: req.body.email });
  console.log(existinguser);
  if (existinguser) {
    res.status(200).send("Email already exist");
  } else {
    const newUser = await User.create(req.body);
    res.status(200).send({
      status: "Register Successfully",
      data: newUser,
    });
    res.send(newUser);
  }
});
authRoutes.post("/login", async (req, res) => {
  try {
    console.log(req.body);
    const existinguser = await User.findOne({ email: req.body.email });
    console.log(existinguser);
    if (existinguser === null) {
      res.status(400).send({
        status: "Email not register,Kindly signup ",
      });
    }
    if (existinguser.password === req.body.password) {
      res.status(200).send({
        status: "Login successfully",
        name: existinguser.email.split("@")[0],
        id: existinguser._id,
      });
    } else {
      res.status(400).send({
        status: "Wrong password,Enter valid password",
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});
module.exports = authRoutes;

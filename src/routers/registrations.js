const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../utils/prisma.js");
const { user } = require("../utils/prisma.js");

router.post("/", async (req, res) => {
  // Get the username and password from request body
  const { username, password } = req.body;
  const saltRounds = 5;

  // Hash the password: https://github.com/kelektiv/node.bcrypt.js#with-promises
  bcrypt.hash(password, saltRounds).then(async function (hash) {
    // Save the user using the prisma user model, setting their password to the hashed version
    const newUser = await prisma.user.create({
      data: {
        username: username,
        password: hash,
      },
    });
    // Respond back to the client with the created users username and id
    res.status(201).json({ user: newUser });
  });
});

module.exports = router;

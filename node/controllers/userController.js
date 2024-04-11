import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";

import User from "../models/User.js";
import { generateJWT, generateId } from "../helpers/tokens.js";
import { registerEmail, forgotPassword } from "../helpers/emails.js";

const loginForm = (req, res) => {
  res.render("auth/login", {
    page: "Log In",
    csrfToken: req.csrfToken(),
  });
};

const login = async (req, res) => {
  await check("email").isEmail().withMessage("Email is required").run(req);
  await check("password")
    .notEmpty()
    .withMessage("Password is required")
    .run(req);

  let result = validationResult(req);

  // Validate result is empty (no errors)
  if (!result.isEmpty()) {
    return res.render("auth/login", {
      page: "Log In",
      csrfToken: req.csrfToken(),
      errors: result.array(),
    });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.render("auth/login", {
      page: "Log In",
      csrfToken: req.csrfToken(),
      errors: [{msg:'Incorrect credentials'}]
    });
  }

  if (!user.is_confirmed){
    return res.render("auth/login", {
      page: "Log In",
      csrfToken: req.csrfToken(),
      errors: [{msg:'Please confirm your email to log in'}]
    });
  }

  if(!user.checkPassword(password)){
    return res.render("auth/login", {
      page: "Log In",
      csrfToken: req.csrfToken(),
      errors: [{msg:'Incorrect credentials'}]
    });
  }

  const token = generateJWT({id: user.id, name: user.name})

  return res.cookie('_token', token, {
    httpOnly: true,
    // secure:true
  }).redirect('/my-properties')

};

const registerForm = (req, res) => {
  res.render("auth/register", {
    page: "Register",
    csrfToken: req.csrfToken(),
  });
};

const register = async (req, res) => {
  // Validation
  await check("name").notEmpty().withMessage("Name is required").run(req);
  await check("email").isEmail().withMessage("Email is not correct").run(req);
  await check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .run(req);
  await check("password_confirmation").equals(req.body.password).run(req);

  let result = validationResult(req);

  // Validate result is empty (no errors)
  if (!result.isEmpty()) {
    return res.render("auth/register", {
      page: "Register",
      csrfToken: req.csrfToken(),
      errors: result.array(),
      user: {
        name: req.body.name,
        email: req.body.email,
      },
    });
  }

  const { name, email, password } = req.body;

  const userExists = await User.findOne({ where: { email } });

  if (userExists) {
    return res.render("auth/register", {
      page: "Register",
      csrfToken: req.csrfToken(),
      errors: [{ msg: "Email is already in use" }],
      user: {
        name: req.body.name,
        email: req.body.email,
      },
      l,
    });
  }

  const user = await User.create({
    name: name,
    email: email,
    password: password,
    token: generateId(),
  });

  // Send email confirmation
  registerEmail({
    name: user.name,
    email: user.email,
    token: user.token,
  });

  res.render("templates/message", {
    page: "You have been registered",
    message:
      "You have been registered. Please check your email to confirm your account",
  });
};

const confirmEmail = async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({ where: { token } });

  if (!user) {
    return res.render("auth/confirmation-account", {
      page: "Error in confirmation",
      message: "There was an error confirming your account, please try again",
      error: true,
    });
  }

  user.token = null;
  user.is_confirmed = true;

  await user.save();

  return res.render("auth/confirmation-account", {
    page: "Account confirmed",
    message:
      "Your account has been confirmed successfully! You can now log in.",
  });
};

const resetPassowrdForm = (req, res) => {
  res.render("auth/reset-password", {
    page: "Reset your password",
    csrfToken: req.csrfToken(),
  });
};

const resetPassword = async (req, res) => {
  // Validation
  await check("email").isEmail().withMessage("Email is not correct").run(req);

  let result = validationResult(req);

  // Validate result is empty (no errors)
  if (!result.isEmpty()) {
    return res.render("auth/reset-password", {
      page: "Reset your password",
      csrfToken: req.csrfToken(),
      errors: result.array(),
    });
  }

  // Search
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.render("auth/reset-password", {
      page: "Reset your password",
      csrfToken: req.csrfToken(),
      errors: [{ msg: "Email not found" }],
    });
  }

  user.token = generateId();
  await user.save();

  forgotPassword({
    name: user.name,
    email: user.email,
    token: user.token,
  });

  res.render("templates/message", {
    page: "Reset your password",
    message:
      "We have sent you an email to reset your password. Please check your inbox.",
  });
};

const checkToken = async (req, res, next) => {
  const { token } = req.params;

  const user = await User.findOne({ where: { token } });

  if (!user) {
    return res.render("templates/message", {
      page: "Reset your password",
      message: "An error occurred. Please try again",
      error: true,
    });
  }

  res.render("auth/new-password", {
    page: "Reset your password",
    csrfToken: req.csrfToken(),
  });
};

const newPassword = async (req, res) => {
  await check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .run(req);

  let result = validationResult(req);

  // Validate result is empty (no errors)
  if (!result.isEmpty()) {
    return res.render("auth/new-password", {
      page: "Reset your password",
      csrfToken: req.csrfToken(),
      errors: result.array(),
    });
  }

  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ where: { token } });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.token = null;

  await user.save();

  res.render("auth/confirmation-account", {
    page: "Password updated",
    message: "Your password has been updated successfully! You can now log in.",
  });
};

export {
  loginForm,
  login,
  registerForm,
  register,
  confirmEmail,
  resetPassowrdForm,
  resetPassword,
  checkToken,
  newPassword,
};

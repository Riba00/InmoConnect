import { check, validationResult } from "express-validator";
import User from "../models/User.js";
import { generateId } from "../helpers/tokens.js";
import { registerEmail } from "../helpers/emails.js";

const loginForm = (req, res) => {
  res.render("auth/login", {
    page: "Log In",
  });
};

const registerForm = (req, res) => {
  res.render("auth/register", {
    page: "Register",
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
  });
};

export { loginForm, registerForm, register, confirmEmail, resetPassowrdForm };

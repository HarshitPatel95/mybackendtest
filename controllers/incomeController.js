const asyncHandler = require("express-async-handler");
const Income = require("../models/incomeModel");

// @desc    Get Income
// @route   GET /api/income
// @access  Private
const getIncome = asyncHandler(async (req, res) => {
  const income = await Income.find();

  res.status(200).json(income);
});

// @desc    Set Income
// @route   POST /api/income
// @access  Private
const setIncome = asyncHandler(async (req, res) => {
  if (!req.body.income_title && !req.body.income_amount) {
    res.status(400);
    throw new Error("Please fill these fields");
  }

  const income = await Income.create({
    income_date: req.body.income_date,
    income_title: req.body.income_title,
    income_amount: req.body.income_amount,
    income_receipt: req.body.income_receipt,
    category_id: req.body.category_id,
    user: req.user.id,
  });

  res.status(200).json(income);
});

// @desc    Update Income
// @route   PUT /api/income/:id
// @access  Private
const updateIncome = asyncHandler(async (req, res) => {
  const income = await Income.findById(req.params.id);

  if (!income) {
    res.status(400);
    throw new Error("Income not found");
  }

  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  // Make sure the logged in user matches the income user
  if (income.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const updatedIncome = await Income.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  res.status(200).json(updatedIncome);
});

// @desc    Delete Income
// @route   DELETE /api/income/:id
// @access  Private
const deleteIncome = asyncHandler(async (req, res) => {
  const income = await Income.findById(req.params.id);

  if (!income) {
    res.status(400);
    throw new Error("Income not found");
  }

  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  // Make sure the logged in user matches the income user
  if (income.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await income.remove();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getIncome,
  setIncome,
  updateIncome,
  deleteIncome,
};

const Question = require("../model/QuestionModel");
const bcrypt = require("bcryptjs");
module.exports.setQuestion = async (req, res, next) => {
  try {
    console.log(req.body);
    const { set, queNo, queUrl, queAns } = req.body;
    const hashedAns = await bcrypt.hash(queAns.toLowerCase(), 10);
    const ques = await Question.create({
      set,
      queNo,
      queUrl,
      queAns: hashedAns,
    });

    return res.json({
      status: true,
      ques,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.updateQuestion = async (req, res, next) => {
  try {
    const { set, queNo, queUrl, queAns } = req.body;
    if (!set && !queNo) {
      return res.json({
        msg: "Question is not found",
        status: false,
      });
    }
    const hashedAns = await bcrypt.hash(queAns, 10);
    const updatedQuestion = await Question.findOneAndUpdate(
      { set: set, queNo: queNo },
      { queUrl: queUrl, queAns: hashedAns },
      { new: true }
    );
    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }
    return res.json({
      msg: "Question updated successfully",
      updatedQuestion,
      status: true,
    });
  } catch (error) {
    next(error);
  }
};

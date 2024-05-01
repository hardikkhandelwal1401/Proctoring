import mongoose from "mongoose";

const ResultSchema = mongoose.Schema(
  {
    correctAnswers: { type: Number, default: 0, required: true },
    examId: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Result = mongoose.model("Result", ResultSchema);

export default Result;

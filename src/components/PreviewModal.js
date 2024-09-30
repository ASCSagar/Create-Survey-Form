import React from "react";
import { X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { useFormBuilder } from "../hooks/useFormBuilder";
import { QuestionTypes } from "../utils/constants";

const mapQuestionType = (type) => {
  switch (type) {
    case QuestionTypes.SHORT_ANSWER:
      return "short_answer";
    case QuestionTypes.PARAGRAPH:
      return "paragraph";
    case QuestionTypes.MULTIPLE_CHOICE:
      return "multiple_choice";
    case QuestionTypes.CHECKBOX:
      return "checkbox";
    case QuestionTypes.DROPDOWN:
      return "dropdown";
    default:
      return "short_answer";
  }
};

const PreviewModal = ({ onClose }) => {
  const { survey, setSurvey } = useFormBuilder();

  const formData = {
    title: survey.title,
    description: survey.description,
    is_public: survey.is_public,
    questions: survey.questions.map((question, index) => ({
      text: question.text,
      question_type: mapQuestionType(question.type),
      required: question.required,
      order: index + 1,
      choices: question.options.map((option, optIndex) => ({
        text: option,
        order: optIndex + 1,
      })),
    })),
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch("https://gazra.org/gazra/api/surveys/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 201) {
        toast.success("Survey created successfully!");
        setSurvey({
          id: uuidv4(),
          title: "Enter Form Title",
          description: "Enter Form Description",
          is_public: true,
          questions: [],
        });
        onClose();
      } else {
        console.error("error");
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-lg p-6 relative overflow-auto max-h-full">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-2">{survey.title}</h2>
        <p className="text-gray-600 mb-6">{survey.description}</p>

        {survey.questions && survey.questions.length > 0 ? (
          survey.questions.map((question, index) => (
            <div key={question.id} className="mb-4">
              <p className="font-medium mb-2">
                {index + 1}. {question.text}
                {question.required && <span className="text-red-500"> *</span>}
              </p>
              {renderPreviewInput(question)}
            </div>
          ))
        ) : (
          <p className="text-gray-600">No Questions Added To The Form.</p>
        )}

        <button
          className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

const renderPreviewInput = (question) => {
  switch (question.type) {
    case "Short Answer":
      return (
        <input
          type="text"
          className="w-full border border-gray-300 p-2 rounded"
          disabled
        />
      );
    case "Paragraph":
      return (
        <textarea
          className="w-full border border-gray-300 p-2 rounded resize-none"
          rows={4}
          disabled
        ></textarea>
      );
    case "Multiple Choice":
      return (
        <div>
          {question.options.map((option, index) => (
            <label key={index} className="block">
              <input
                type="radio"
                name={question.id}
                disabled
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      );
    case "Checkboxes":
      return (
        <div>
          {question.options.map((option, index) => (
            <label key={index} className="block">
              <input
                type="checkbox"
                name={`${question.id}-${index}`}
                disabled
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      );
    case "Dropdown":
      return (
        <select className="w-full border border-gray-300 p-2 rounded" disabled>
          {question.options.map((option, index) => (
            <option key={index}>{option}</option>
          ))}
        </select>
      );
    default:
      return null;
  }
};

export default PreviewModal;

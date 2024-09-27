import React from "react";
import { useFormBuilder } from "../hooks/useFormBuilder";
import { X } from "lucide-react";

const PreviewModal = ({ onClose }) => {
  const { survey } = useFormBuilder();

  console.log("----survey------>",survey);

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
        {survey.questions.map((question, index) => (
          <div key={question.id} className="mb-4">
            <p className="font-medium mb-2">
              {index + 1}. {question.text}
              {question.required && <span className="text-red-500"> *</span>}
            </p>
            {renderPreviewInput(question)}
          </div>
        ))}
        <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
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
    // Implement other types as needed
    default:
      return null;
  }
};

export default PreviewModal;

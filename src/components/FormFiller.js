import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useParams } from "react-router-dom";
import { useFormBuilder } from "../hooks/useFormBuilder";

const FormFiller = () => {
  const { formId } = useParams();
  const { loadForm, survey } = useFormBuilder();
  const [responses, setResponses] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isStepper, setIsStepper] = useState(false);

  useEffect(() => {
    loadForm(formId);
  }, [formId, loadForm]);

  useEffect(() => {
    if (survey.questions.length > 5) {
      setIsStepper(true);
    } else {
      setIsStepper(false);
    }
  }, [survey.questions.length]);

  const handleChange = (questionId, value) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Responses:", responses);
    alert("Form Submitted! Check the console for responses.");
  };

  const totalSteps = isStepper ? Math.ceil(survey.questions.length / 5) : 1;

  const getCurrentQuestions = () => {
    if (!isStepper) return survey.questions;
    const start = currentStep * 5;
    const end = start + 5;
    return survey.questions.slice(start, end);
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="relative">
        <button
          className="absolute top-0 right-0 text-gray-500 hover:text-gray-700"
          onClick={() => window.history.back()}
        >
          <X size={24} />
        </button>
      </div>
      <h2 className="text-3xl font-bold mb-2">{survey.title}</h2>
      <p className="text-gray-600 mb-6">{survey.description}</p>
      <form onSubmit={handleSubmit}>
        {isStepper && (
          <div className="flex items-center mb-6">
            {Array.from({ length: totalSteps }, (_, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === index
                      ? "bg-purple-600 text-white font-bold"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {index + 1}
                </div>
                {index < totalSteps - 1 && (
                  <div
                    className={`flex-1 h-1 ${
                      currentStep > index ? "bg-purple-600" : "bg-gray-300"
                    } mx-2`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        )}
        {isStepper
          ? getCurrentQuestions().map((question, index) => (
              <QuestionFiller
                key={question.id}
                question={question}
                response={responses[question.id] || ""}
                onChange={handleChange}
              />
            ))
          : survey.questions.map((question, index) => (
              <QuestionFiller
                key={question.id}
                question={question}
                response={responses[question.id] || ""}
                onChange={handleChange}
              />
            ))}
        {isStepper ? (
          <div className="flex justify-between mt-6">
            {currentStep > 0 && (
              <button
                type="button"
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Previous
              </button>
            )}
            {currentStep < totalSteps - 1 && (
              <button
                type="button"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                Next
              </button>
            )}
            {currentStep === totalSteps - 1 && (
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Submit
              </button>
            )}
          </div>
        ) : (
          <button
            type="submit"
            className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Submit
          </button>
        )}
      </form>
    </div>
  );
};

const QuestionFiller = ({ question, response, onChange }) => {
  const handleInputChange = (e) => {
    const { checked, value } = e.target;
    if (question.type === "Checkboxes") {
      let newValue = response ? [...response] : [];
      if (checked) {
        newValue.push(value);
      } else {
        newValue = newValue.filter((item) => item !== value);
      }
      onChange(question.id, newValue);
    } else {
      onChange(question.id, value);
    }
  };

  return (
    <div className="mb-6">
      <p className="font-medium mb-2">
        {question.text}
        {question.required && <span className="text-red-500"> *</span>}
      </p>
      {renderInput(question, response, handleInputChange)}
    </div>
  );
};

const renderInput = (question, response, handleChange) => {
  switch (question.type) {
    case "Short Answer":
      return (
        <input
          type="text"
          className="w-full border border-gray-300 p-2 rounded"
          value={response}
          onChange={handleChange}
          required={question.required}
        />
      );
    case "Paragraph":
      return (
        <textarea
          className="w-full border border-gray-300 p-2 rounded resize-none"
          rows={4}
          value={response}
          onChange={handleChange}
          required={question.required}
        ></textarea>
      );
    case "Multiple Choice":
      return (
        <div>
          {question.options.map((option, index) => (
            <label key={index} className="block mb-1">
              <input
                type="radio"
                name={question.id}
                value={option}
                checked={response === option}
                onChange={handleChange}
                required={question.required}
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
            <label key={index} className="block mb-1">
              <input
                type="checkbox"
                name={`${question.id}-${index}`}
                value={option}
                checked={response.includes(option)}
                onChange={handleChange}
                required={question.required}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      );
    case "Dropdown":
      return (
        <select
          className="w-full border border-gray-300 p-2 rounded"
          value={response}
          onChange={handleChange}
          required={question.required}
        >
          <option value="">Select an option</option>
          {question.options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    case "File Upload":
      return (
        <input
          type="file"
          className="w-full"
          onChange={(e) => handleChange(e)}
          required={question.required}
        />
      );
    case "Date":
      return (
        <input
          type="date"
          className="w-full border border-gray-300 p-2 rounded"
          value={response}
          onChange={handleChange}
          required={question.required}
        />
      );
    case "Time":
      return (
        <input
          type="time"
          className="w-full border border-gray-300 p-2 rounded"
          value={response}
          onChange={handleChange}
          required={question.required}
        />
      );
    // Implement other types as needed
    default:
      return null;
  }
};

export default FormFiller;

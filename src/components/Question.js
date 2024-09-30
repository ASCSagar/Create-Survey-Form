import React from 'react';
import { Trash2, Menu } from 'lucide-react';
import { useFormBuilder } from '../hooks/useFormBuilder';
import { QuestionTypes } from "../utils/constants";
const Question = ({ question }) => {
  const { updateQuestion, deleteQuestion } = useFormBuilder();

  const handleTextChange = (e) => {
    updateQuestion(question.id, { text: e.target.value });
  };

  const handleRequiredChange = (e) => {
    updateQuestion(question.id, { required: e.target.checked });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...question.options];
    newOptions[index] = value;
    updateQuestion(question.id, { options: newOptions });
  };

  const addOption = () => {
    const newOptions = [...question.options, ''];
    updateQuestion(question.id, { options: newOptions });
  };

  const removeOption = (index) => {
    const newOptions = question.options.filter((_, i) => i !== index);
    updateQuestion(question.id, { options: newOptions });
  };

  const renderOptions = () => {
    if (
      question.type === QuestionTypes.MULTIPLE_CHOICE ||
      question.type === QuestionTypes.CHECKBOX ||
      question.type === QuestionTypes.DROPDOWN
    ) {
      return (
        <div className="mt-4">
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center w-full mb-2">
              <input
                type={
                  question.type === QuestionTypes.MULTIPLE_CHOICE
                    ? 'radio'
                    : question.type === QuestionTypes.CHECKBOX
                    ? 'checkbox'
                    : 'text'
                }
                disabled
                className="mr-2"
              />
              <input
                type="text"
                className="flex-1 border-b border-gray-300 outline-none"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
              />
              <button
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={() => removeOption(index)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            className="text-blue-500 hover:text-blue-700 text-sm"
            onClick={addOption}
          >
            + Add Option
          </button>
        </div>
      );
    }
    return null;
  };

  const renderQuestionInput = () => {
    switch (question.type) {
      case QuestionTypes.SHORT_ANSWER:
        return (
          <input
            type="text"
            className="w-full border-b border-gray-300 outline-none"
            placeholder="Short answer text"
            disabled
          />
        );
      case QuestionTypes.PARAGRAPH:
        return (
          <textarea
            className="w-full border border-gray-300 rounded p-2 outline-none resize-none"
            rows={4}
            placeholder="Paragraph text"
            disabled
          />
        );
      case QuestionTypes.DROPDOWN:
        return (
          <select className="w-full border border-gray-300 rounded p-2 outline-none" disabled>
            {question.options.map((option, index) => (
              <option key={index}>{option}</option>
            ))}
          </select>
        );
      // Implement other types like Date, File Upload, etc.
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md relative group">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <input
            className="text-lg font-medium w-full border-b border-gray-300 outline-none"
            value={question.text}
            onChange={handleTextChange}
            placeholder="Question Text"
          />
          <div className="mt-2">
            {renderOptions()}
            {renderQuestionInput()}
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => deleteQuestion(question.id)}
          >
            <Trash2 size={20} />
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <Menu size={20} />
          </button>
        </div>
      </div>
      <div className="flex items-center mt-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={question.required}
            onChange={handleRequiredChange}
            className="form-checkbox h-5 w-5 text-purple-600"
          />
          <span className="text-sm text-gray-700">Required</span>
        </label>
      </div>
    </div>
  );
};

export default Question;

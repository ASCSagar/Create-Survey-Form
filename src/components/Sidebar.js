import React from "react";
import { PlusCircle, Type, LayoutGrid } from "lucide-react";
import { QuestionTypes } from "../utils/constants";
import { useFormBuilder } from "../hooks/useFormBuilder";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const { addQuestion } = useFormBuilder();

  const handleAddQuestion = (type) => {
    addQuestion(type);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="w-20 bg-white shadow-md flex flex-col items-center p-4 space-y-4">
      <button
        className="flex flex-col items-center text-gray-600 hover:text-purple-600"
        onClick={() => handleAddQuestion(QuestionTypes.SHORT_ANSWER)}
      >
        <Type size={24} />
        <span className="text-xs mt-1">Short Answer</span>
      </button>
      <button
        className="flex flex-col items-center text-gray-600 hover:text-purple-600"
        onClick={() => handleAddQuestion(QuestionTypes.PARAGRAPH)}
      >
        <Type size={24} />
        <span className="text-xs mt-1">Paragraph</span>
      </button>
      <button
        className="flex flex-col items-center text-gray-600 hover:text-purple-600"
        onClick={() => handleAddQuestion(QuestionTypes.MULTIPLE_CHOICE)}
      >
        <PlusCircle size={24} />
        <span className="text-xs mt-1">Multiple Choice</span>
      </button>
      <button
        className="flex flex-col items-center text-gray-600 hover:text-purple-600"
        onClick={() => handleAddQuestion(QuestionTypes.CHECKBOX)}
      >
        <PlusCircle size={24} />
        <span className="text-xs mt-1">Checkboxes</span>
      </button>
      <button
        className="flex flex-col items-center text-gray-600 hover:text-purple-600"
        onClick={() => handleAddQuestion(QuestionTypes.DROPDOWN)}
      >
        <LayoutGrid size={24} />
        <span className="text-xs mt-1">Dropdown</span>
      </button>
      <button
        className="mt-auto bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 text-sm"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;

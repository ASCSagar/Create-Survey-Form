import React, { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { QuestionTypes } from "../utils/constants";

const FormBuilderContext = createContext();

export const FormBuilderProvider = ({ children }) => {
  const [currentFormId, setCurrentFormId] = useState(null);
  const [survey, setSurvey] = useState({
    id: uuidv4(),
    title: "Enter Form Title",
    description: "Enter Form Description",
    is_public: true,
    questions: [],
  });

  // Add a new question to the current survey
  const addQuestion = (type = QuestionTypes.SHORT_ANSWER) => {
    const newQuestion = {
      id: uuidv4(),
      type: type,
      text: "Untitled Question",
      required: false,
      options:
        type === QuestionTypes.MULTIPLE_CHOICE ||
        type === QuestionTypes.CHECKBOX ||
        type === QuestionTypes.DROPDOWN
          ? ["Option 1"]
          : [],
    };
    setSurvey((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  // Update the survey's title or description
  const updateSurvey = (updates) => {
    setSurvey((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  // Update a specific question within the survey
  const updateQuestion = (id, updates) => {
    setSurvey((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === id ? { ...q, ...updates } : q
      ),
    }));
  };

  // Delete a specific question from the survey
  const deleteQuestion = (id) => {
    setSurvey((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id),
    }));
  };

  // Reorder questions in the survey
  const reorderQuestions = (startIndex, endIndex) => {
    const result = Array.from(survey.questions);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setSurvey((prev) => ({
      ...prev,
      questions: result,
    }));
  };

  return (
    <FormBuilderContext.Provider
      value={{
        currentFormId,
        setCurrentFormId,
        survey,
        setSurvey,
        addQuestion,
        updateSurvey,
        updateQuestion,
        deleteQuestion,
        reorderQuestions,
      }}
    >
      {children}
    </FormBuilderContext.Provider>
  );
};

export const useFormBuilder = () => useContext(FormBuilderContext);

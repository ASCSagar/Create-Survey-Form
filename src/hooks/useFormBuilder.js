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

  const transformSurveyData = () => {
    return {
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
    };
  };

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
        transformSurveyData,
      }}
    >
      {children}
    </FormBuilderContext.Provider>
  );
};

export const useFormBuilder = () => useContext(FormBuilderContext);

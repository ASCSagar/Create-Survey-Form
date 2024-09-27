// src/hooks/useFormBuilder.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { QuestionTypes } from '../utils/constants';

const FormBuilderContext = createContext();

export const FormBuilderProvider = ({ children }) => {
  const [forms, setForms] = useState({});
  const [currentFormId, setCurrentFormId] = useState(null);
  const [survey, setSurvey] = useState({
    id: uuidv4(),
    title: 'Untitled Form',
    description: 'Form Description',
    questions: [],
  });

  // Load forms from localStorage on mount
  useEffect(() => {
    const savedForms = localStorage.getItem('forms');
    if (savedForms) {
      setForms(JSON.parse(savedForms));
    }
  }, []);

  // Save forms to localStorage whenever 'forms' changes
  useEffect(() => {
    localStorage.setItem('forms', JSON.stringify(forms));
  }, [forms]);

  // Load a specific form based on formId
  const loadForm = (formId) => {
    const form = forms[formId];
    if (form) {
      setSurvey(form);
      setCurrentFormId(formId);
    } else {
      alert('Form not found!');
    }
  };

  // Add a new question to the current survey
  const addQuestion = (type = QuestionTypes.SHORT_ANSWER) => {
    const newQuestion = {
      id: uuidv4(),
      type: type,
      text: 'Untitled Question',
      required: false,
      options:
        type === QuestionTypes.MULTIPLE_CHOICE ||
        type === QuestionTypes.CHECKBOX ||
        type === QuestionTypes.DROPDOWN
          ? ['Option 1']
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

  // Save the current survey to 'forms' with its 'id' as the key
  const saveForm = () => {
    setForms((prev) => ({
      ...prev,
      [survey.id]: survey,
    }));
    alert('Form Saved Successfully!');
  };

  return (
    <FormBuilderContext.Provider
      value={{
        forms,
        currentFormId,
        setCurrentFormId,
        loadForm,
        survey,
        addQuestion,
        updateSurvey,
        updateQuestion,
        deleteQuestion,
        reorderQuestions,
        saveForm,
      }}
    >
      {children}
    </FormBuilderContext.Provider>
  );
};

export const useFormBuilder = () => useContext(FormBuilderContext);

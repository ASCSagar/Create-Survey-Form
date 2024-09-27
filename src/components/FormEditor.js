import React from 'react';
import { useFormBuilder } from '../hooks/useFormBuilder';
import Question from './Question';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const FormEditor = () => {
  const { survey, updateSurvey, reorderQuestions } = useFormBuilder();

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    reorderQuestions(result.source.index, result.destination.index);
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <input
          className="text-3xl font-bold w-full mb-2 border-b border-gray-300 outline-none"
          value={survey.title}
          onChange={(e) => updateSurvey({ title: e.target.value })}
          placeholder="Form Title"
        />
        <textarea
          className="w-full text-gray-600 outline-none resize-none"
          value={survey.description}
          onChange={(e) => updateSurvey({ description: e.target.value })}
          placeholder="Form Description"
          rows={2}
        />
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="questions">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {survey.questions.map((question, index) => (
                <Draggable
                  key={question.id}
                  draggableId={question.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Question question={question} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default FormEditor;

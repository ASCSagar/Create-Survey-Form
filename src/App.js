import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import AuthRoute from "./components/AuthRoute";
import FormEditor from "./components/FormEditor";
import FormFiller from "./components/FormFiller";
import PreviewModal from "./components/PreviewModal";

const App = () => {
  const [isPreview, setIsPreview] = useState(false);
  const location = useLocation();

  const containerClass =
    location.pathname !== "/login"
      ? "flex h-screen bg-gray-100"
      : "h-screen bg-gray-100";

  return (
    <div className={containerClass}>
      <ToastContainer
        limit={1}
        theme="colored"
        position="top-center"
        autoClose={3000}
        className="toast-container"
      />
      {location.pathname !== "/login" && <Sidebar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <AuthRoute>
              <FormEditor />
            </AuthRoute>
          }
        />
        <Route
          path="/form/:formId"
          element={
            <AuthRoute>
              <FormFiller />
            </AuthRoute>
          }
        />
      </Routes>
      {location.pathname !== "/login" && (
        <button
          className="fixed bottom-4 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700"
          onClick={() => setIsPreview(true)}
        >
          Preview
        </button>
      )}
      {isPreview && <PreviewModal onClose={() => setIsPreview(false)} />}
    </div>
  );
};

export default App;

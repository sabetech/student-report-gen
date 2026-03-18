import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AuthenticatedLayout from './components/Layout/AuthenticatedLayout';
import ExamConfigs from './pages/ExamConfigs';
import ExamConfigEditor from './pages/ExamConfigEditor';
import SubjectManagement from './pages/SubjectManagement';
import UploadData from './pages/UploadData';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route element={<AuthenticatedLayout />}>
          <Route path="/exam-configs" element={<ExamConfigs />} />
          <Route path="/exam-configs/new" element={<ExamConfigEditor />} />
          <Route path="/exam-configs/edit/:id" element={<ExamConfigEditor />} />
          <Route path="/subjects" element={<SubjectManagement />} />
          <Route path="/upload" element={<UploadData />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/" element={<Navigate to="/exam-configs" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

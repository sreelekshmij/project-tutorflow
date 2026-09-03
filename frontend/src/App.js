import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/auth/Login/Login";
import SignUp from "./pages/auth/SignUp/SignUp";

import TutorDashboard from "./pages/tutor/TutorDashboard/TutorDashboard";
import Students from "./pages/tutor/Students/Students";
import StudentDetails from "./pages/tutor/Students/StudentDetails";
import EditStudent from "./pages/tutor/Students/EditStudent";

import StudentDashboard from "./pages/student/StudentDashboard/StudentDashboard";

import ProtectedRoute from "./components/ProtectedRoutes/ProtectedRoute";
import TutorLayout from "./layouts/TutorLayout/TutorLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route
          path="/tutor"
          element={
            <ProtectedRoute allowedRole="tutor">
              <TutorLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="dashboard"
            element={<TutorDashboard />}
          />

          <Route
            path="students"
            element={<Students />}
          />

          <Route
            path="students/:studentId"
            element={<StudentDetails />}
          />

          <Route
            path="students/:studentId/edit"
            element={<EditStudent />}
          />
        </Route>

        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
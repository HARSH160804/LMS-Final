import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Public Pages
import Home from './pages/Home';
import CourseDetail from './pages/CourseDetail';
import NotFound from './pages/NotFound';

// Auth Pages
import Login from './pages/Login';
import Signup from './pages/Signup';

// Protected Pages
import Profile from './pages/Profile';
import MyCourses from './pages/MyCourses';
import LearnCourse from './pages/LearnCourse';

// Instructor Pages
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import CreateCourse from './pages/instructor/CreateCourse';
import ManageCourse from './pages/instructor/ManageCourse';
import ManageLectures from './pages/instructor/ManageLectures';

// ⚠️ TEMPORARY DEBUG PAGE - DELETE AFTER DEBUGGING
import DebugFetch from './pages/DebugFetch';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/course/:id" element={<CourseDetail />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-courses" element={<MyCourses />} />
        </Route>

        {/* Protected Course Learning (Full Screen) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/course/:id/learn" element={<LearnCourse />} />
        </Route>

        {/* Instructor Routes */}
        <Route element={
          <ProtectedRoute requiredRole="instructor">
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="/instructor" element={<InstructorDashboard />} />
          <Route path="/instructor/create" element={<CreateCourse />} />
          <Route path="/instructor/course/:courseId" element={<ManageCourse />} />
          <Route path="/instructor/course/:courseId/lectures" element={<ManageLectures />} />
        </Route>

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* ⚠️ TEMPORARY DEBUG ROUTE - DELETE AFTER DEBUGGING */}
        <Route path="/debug-fetch" element={<DebugFetch />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;


import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout.tsx';
import { Home } from './pages/Home.tsx';
import { About } from './pages/About.tsx';
import { Programs } from './pages/Programs.tsx';
import { Coaches } from './pages/Coaches.tsx';
import { Membership } from './pages/Membership.tsx';
import { Blog } from './pages/Blog.tsx';
import { Testimonials } from './pages/Testimonials.tsx';
import { PersonalizedPlans } from './pages/PersonalizedPlans.tsx';
import { Counseling } from './pages/Counseling.tsx';
import { LegalViewer } from './pages/LegalViewer.tsx';
import { StorageService } from './services/storage.ts';

// Admin Pages
import { AdminLogin } from './admin/AdminLogin.tsx';
import { AdminDashboard } from './admin/AdminDashboard.tsx';
import { AdminPrograms } from './admin/AdminPrograms.tsx';
import { AdminLayout } from './admin/AdminLayout.tsx';
import { AdminLeads } from './admin/AdminLeads.tsx';
import { AdminCoaches } from './admin/AdminCoaches.tsx';
import { AdminBlogs } from './admin/AdminBlogs.tsx';
import { AdminOffers } from './admin/AdminOffers.tsx';
import { AdminSettings } from './admin/AdminSettings.tsx';
import { AdminMemberships } from './admin/AdminMemberships.tsx';
import { AdminTestimonials } from './admin/AdminTestimonials.tsx';
import { AdminPlanInquiries } from './admin/AdminPlanInquiries.tsx';
import { AdminLegalPages } from './admin/AdminLegalPages.tsx';
import { AdminCounseling } from './admin/AdminCounseling.tsx';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // In a real app, check session token. Here we use a simple check against sessionStorage
    const isAuth = sessionStorage.getItem('admin_session') === 'true';
    if (!isAuth) return <Navigate to="/admin/login" replace />;
    return <AdminLayout>{children}</AdminLayout>;
};

const App: React.FC = () => {
  useEffect(() => {
    StorageService.init();
  }, []);

  return (
    <HashRouter>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/programs" element={<ProtectedRoute><AdminPrograms /></ProtectedRoute>} />
        <Route path="/admin/coaches" element={<ProtectedRoute><AdminCoaches /></ProtectedRoute>} />
        <Route path="/admin/leads" element={<ProtectedRoute><AdminLeads /></ProtectedRoute>} />
        <Route path="/admin/blogs" element={<ProtectedRoute><AdminBlogs /></ProtectedRoute>} />
        <Route path="/admin/offers" element={<ProtectedRoute><AdminOffers /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
        <Route path="/admin/memberships" element={<ProtectedRoute><AdminMemberships /></ProtectedRoute>} />
        <Route path="/admin/testimonials" element={<ProtectedRoute><AdminTestimonials /></ProtectedRoute>} />
        <Route path="/admin/plan-inquiries" element={<ProtectedRoute><AdminPlanInquiries /></ProtectedRoute>} />
        <Route path="/admin/legal-pages" element={<ProtectedRoute><AdminLegalPages /></ProtectedRoute>} />
        <Route path="/admin/counseling" element={<ProtectedRoute><AdminCounseling /></ProtectedRoute>} />

        {/* Public Routes */}
        <Route
          path="*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/programs" element={<Programs />} />
                <Route path="/coaches" element={<Coaches />} />
                <Route path="/membership" element={<Membership />} />
                <Route path="/testimonials" element={<Testimonials />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/personalized-plans" element={<PersonalizedPlans />} />
                <Route path="/counseling" element={<Counseling />} />
                <Route path="/legal/:slug" element={<LegalViewer />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </HashRouter>
  );
};

export default App;

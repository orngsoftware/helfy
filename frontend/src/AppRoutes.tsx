import {Routes, Route, useLocation} from 'react-router-dom'
import LogInForm from './pages/auth/LogIn'
import SignUpForm from './pages/auth/SignUp'
import Dashboard from './pages/dashboard/Dashboard'
import LearnPage from './pages/dashboard/LearnPage'
import Done from './components/Done'
import TaskPage from './pages/dashboard/TaskPage'
import HabitPage from './pages/dashboard/HabitPage'
import CompanionPage from './pages/CompanionPage'
import DashboardLayout from './pages/dashboard/DashboardLayout'
import NotFound from './pages/NotFound'
import LandingPage from './pages/Landing'
import AuthGoogle from './pages/AuthGoogle'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import PlanChoicePage from './pages/PlanChoice'
import SavedLearnings from './pages/dashboard/SavedLearnings'
import { AnimatePresence } from 'motion/react'

const AppRoutes = () => {
  const location = useLocation()

  return (
    <AnimatePresence mode='wait'>
    <Routes location={location} key={location.pathname}>
        <Route path='/' element={<LandingPage />} />
        <Route path='/log-in' element={<LogInForm />} />
        <Route path='/sign-up' element={<SignUpForm />} />
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
        <Route path='/terms-of-service' element={<TermsOfService />} />
        <Route element={<DashboardLayout />} >
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/learn' element={<LearnPage />} />
          <Route path='/done/learn' element={<Done />} />
          <Route path='/done/task' element={<Done doneType="task" />} />
          <Route path='/done/fail' element={<Done doneType="fail" />} />
          <Route path='/done/habit' element={<Done doneType="habit" />} />
          <Route path='/task' element={<TaskPage />} />
          <Route path='/habit' element={<HabitPage />} />
          <Route path='/dashboard/companion' element={<CompanionPage />} />
          <Route path='/dashboard/saved' element={<SavedLearnings />} />
        </Route>
        <Route path='/auth/google' element={<AuthGoogle />} />
        <Route path='/plans' element={<PlanChoicePage />} />
        <Route path='*' element={<NotFound />} />
    </Routes>
    </AnimatePresence>
  )
}

export default AppRoutes
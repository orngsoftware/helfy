import {Routes, Route} from 'react-router-dom'
import LogInForm from './pages/auth/LogIn'
import SignUpForm from './pages/auth/SignUp'
import Dashboard from './pages/dashboard/Dashboard'
import LearnPage from './pages/dashboard/LearnPage'
import Done from './components/Done'
import TaskPage from './pages/dashboard/TaskPage'

const AppRoutes = () => {
  return (
    <Routes>
        <Route path='/log-in' element={<LogInForm />} />
        <Route path='/sign-up' element={<SignUpForm />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/learn' element={<LearnPage />} />
        <Route path='/done/learn' element={<Done />} />
        <Route path='/done/task' element={<Done doneType="task" />} />
        <Route path='/done/fail' element={<Done doneType="fail" />} />
        <Route path='/task' element={<TaskPage />} />
    </Routes>
  )
}

export default AppRoutes

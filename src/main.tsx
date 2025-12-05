import { BrowserRouter } from 'react-router'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.tsx'
import './styles/buttons.css'
import './styles/backgrounds.css'
import './styles/textColors.css'
import './styles/others.css'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
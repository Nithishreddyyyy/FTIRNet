import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

import { ThemeProvider } from './context/ThemeContext'
import { PredictionProvider } from './context/PredictionContext'
import { ChatbotProvider } from './context/ChatbotContext'
import { DashboardProvider } from './context/DashboardContext'
import { ReportsProvider } from './context/ReportsContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <PredictionProvider>
          <ChatbotProvider>
            <DashboardProvider>
              <ReportsProvider>
                <App />
              </ReportsProvider>
            </DashboardProvider>
          </ChatbotProvider>
        </PredictionProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
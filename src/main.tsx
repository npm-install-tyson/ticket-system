import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SeatProvider } from './Context/seatContext.tsx'

createRoot(document.getElementById('root')!).render(
  <>
  <SeatProvider>
    <App />
    </SeatProvider>
  </>,
)

import { createRoot } from 'react-dom/client'
import ReactModal from 'react-modal'
import App from './App.tsx'
import './index.css'

const rootEl = document.getElementById("root")!
ReactModal.setAppElement(rootEl)
createRoot(rootEl).render(<App />);

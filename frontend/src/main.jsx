import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'
import Footer from './components/Footer'
import './styles/theme.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App/>
    <Footer/>
  </React.StrictMode>
)

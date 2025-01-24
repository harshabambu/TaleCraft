import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ImageUploader from './components/ImageUploader'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
       <h1 style={{textAlign:"center" , fontSize:"4rem"}}>Tale Craft</h1>
       <p style={{textAlign:"center"}}>A storytelling platform</p>
       <ImageUploader />
       
    </>
  )
}

export default App

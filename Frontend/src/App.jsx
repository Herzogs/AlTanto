import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Form from './components/Form'
import CategoryForm from './components/CategoryForm'
import Test from './components/Test'

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/form" element={<Form />} />
          <Route path="/category" element={<CategoryForm />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

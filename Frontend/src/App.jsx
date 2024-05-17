import { BrowserRouter, Route, Routes} from 'react-router-dom'
import Form from './components/Form'
import CategoryForm from './components/CategoryForm'
import Test from './components/Test'

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/form" component={Form} />
          <Route path="/category" component={CategoryForm} />
          <Route path="/test" component={Test} />
        </Routes>
      </BrowserRouter>
      <h1>Al Tanto </h1>
    </>

  )
}

export default App

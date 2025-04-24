
import { BrowserRouter, Route, Routes } from 'react-router';
import './App.css';
import HompageMap from './map/HompageMap';


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<HompageMap/>} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;

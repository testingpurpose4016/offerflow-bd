import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IndexWrapper from '@/pages/IndexWrapper';
import Admin from '@/pages/Admin';
import NotFound from '@/pages/NotFound';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<IndexWrapper />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
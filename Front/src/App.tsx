
import { AnalysisProvider } from './utils/AnalysisContext';
import Home from './components/Home';


function App() {
  

  return (
    <AnalysisProvider>
      <Home/>
    </AnalysisProvider>
  );
}

export default App;
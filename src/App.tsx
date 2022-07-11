import Telegraph from '@/components/Telegraph';
import { useMobileViewPortHeight } from './hooks';

function App() {
  const mobileViewPortHeight = useMobileViewPortHeight();

  return (
    <div className="h-screen w-screen" style={mobileViewPortHeight.style}>
      <Telegraph />
    </div>
  );
}

export default App;

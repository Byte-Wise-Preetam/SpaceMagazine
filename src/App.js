
import './App.css';
import { FirebaseProvider } from './context/firebase';
import { Outlet } from 'react-router-dom';

function App() {

  return (
    <div className="App">

      <FirebaseProvider>
        <Outlet/>
      </FirebaseProvider>

    </div>
  );
}

export default App;

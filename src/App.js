import './App.css';
import { useState } from "react";
import Login from './components/login/login';
import Main from './components/main/main';

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="App">
      {user ? <Main user={user}/> : <Login setUser={setUser}/>}
    </div>
  );
}

export default App;

import './App.css';
import * as React from "react";
import Schedule from "./Schedule";
import { CookiesProvider } from "react-cookie";


function App() {
    return (
    <div className="App">
        <CookiesProvider>
            <Schedule/>
        </CookiesProvider>
    </div>
  );
}

export default App;

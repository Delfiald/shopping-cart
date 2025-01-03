import { useState } from "react";
import Header from "./components/Header/Header";

function App() {
 const [name, setName] = useState("Hello World React");

 return <Header name={name} setName={setName} />;
}

export default App;

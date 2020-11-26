import React, {useState} from "react";
import "./App.css";
import Header from "./components/Header";
import MainPage from "./pages/MainPage";

function App() {
	const [mode, setMode] = useState("main");
	return (
		<div className="app">
			<Header setMode={setMode} mode={mode} />
			<MainPage setMode={setMode} mode={mode} />
		</div>
	);
}
export default App;

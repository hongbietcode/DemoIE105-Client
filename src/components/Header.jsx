import React, {useEffect} from "react";
import Cookie from "js-cookie";
import logo from "../images/lion.png";

function Header(props) {
	const {mode, setMode} = props;
	const loginButtonHandler = () => {
		if (mode === "login") {
			Cookie.remove("quochoi");
			Cookie.remove("user");
			window.localStorage.removeItem("AESKey");
			window.localStorage.removeItem("clientKey");
			setMode("logout");
			return;
		}
		setMode("do-login");
	};

	useEffect(() => {
		if (Cookie.get("user")) setMode("login");
	});

	return (
		<nav className="navbar is-primary is-flex is-align-items-center is-justify-content-space-between pl-5 pr-5">
			<img
				src={logo}
				alt="Logo"
				style={{height: "40px", cursor: "pointer"}}
				onClick={() => {
					setMode("main");
				}}
			/>
			<div>
				{mode === "login" && <span className="mr-5 is-size-4">{Cookie.get("user")}</span>}
				<div className="button is-light" onClick={loginButtonHandler}>
					{(mode === "login" && "Logout") || "Login"}
				</div>
			</div>
		</nav>
	);
}

export default React.memo(Header);

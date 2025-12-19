import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";


export const Navbar = () => {
	const navigate = useNavigate();
	const { store, dispatch } = useGlobalReducer(); 

	const handleLogout = () => {
		localStorage.removeItem("token");
		dispatch({
			type: "logout"
		});
		navigate(
			"/login"
		);
	};

	const isAuthenticated = !!store.token;

	return (
		<nav className="navbar navbar-light">
			<div className="container text-center">
				<Link to="/">
					<img 
						width="48" 
						height="48" 
						src="https://img.icons8.com/external-tanah-basah-glyph-tanah-basah/48/external-home-essentials-pack-tanah-basah-glyph-tanah-basah.png" 
						alt="external-home-essentials-pack-tanah-basah-glyph-tanah-basah" />
				</Link>
				<div className="ml-auto">
					{isAuthenticated ? (
						<button 
							className="btn btn-primary" 
							onClick={handleLogout}
						>
							Logout
						</button>
					) : (
						<>
							<Link to="/login" className="btn btn-primary">
								Login
							</Link>
							<Link to="/signup" className="btn btn-primary">
								Signup
							</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};
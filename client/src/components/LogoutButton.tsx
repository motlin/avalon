import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type React from "react";
import { useState } from "react";
import styles from "./LogoutButton.module.css";

interface AvalonApi {
	logout: () => void;
}

interface LogoutButtonProps {
	avalon: AvalonApi;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ avalon }) => {
	const [loggingOut, setLoggingOut] = useState(false);

	const handleLogoutClick = () => {
		setLoggingOut(true);
		avalon.logout();
	};

	return (
		<button
			className={`${styles.logoutButton} ${loggingOut ? styles.loading : ""}`}
			onClick={handleLogoutClick}
			disabled={loggingOut}
		>
			<FontAwesomeIcon icon={faRightFromBracket} className={styles.icon} />
			{loggingOut ? "Logging out..." : "Logout"}
		</button>
	);
};

export default LogoutButton;

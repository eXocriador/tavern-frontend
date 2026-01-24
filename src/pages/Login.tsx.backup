import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

// Load Telegram Web App SDK
if (typeof window !== "undefined" && !window.Telegram?.WebApp) {
	const script = document.createElement("script");
	script.src = "https://telegram.org/js/telegram-web-app.js";
	script.async = false;
	document.head.appendChild(script);
}

declare global {
	interface Window {
		Telegram?: {
			WebApp: {
				initData: string;
				initDataUnsafe: {
					user?: {
						id: number;
						first_name?: string;
						last_name?: string;
						username?: string;
					};
				};
				ready: () => void;
				expand: () => void;
			};
		};
	}
}

const Login = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [telegramId, setTelegramId] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [isTelegramWebApp, setIsTelegramWebApp] = useState(false);

	useEffect(() => {
		if (user) {
			navigate("/");
		}
	}, [user, navigate]);

	// Auto-login via Telegram Web App
	useEffect(() => {
		const handleAutoLogin = async () => {
			if (!window.Telegram?.WebApp) {
				setIsTelegramWebApp(false);
				return;
			}

			const tgWebApp = window.Telegram.WebApp;
			tgWebApp.ready();
			tgWebApp.expand();

			const initDataRaw = tgWebApp.initData;
			if (!initDataRaw || initDataRaw.trim() === "") {
				setIsTelegramWebApp(false);
				return;
			}

			const initDataUnsafe = tgWebApp.initDataUnsafe;
			if (!initDataUnsafe?.user?.id) {
				setIsTelegramWebApp(false);
				return;
			}

			setIsTelegramWebApp(true);

			try {
				const API_URL = import.meta.env.VITE_API_URL || "/api";
				const response = await axios.post(
					`${API_URL}/auth/webapp`,
					{ initData: initDataRaw },
					{ headers: { "Content-Type": "application/json" }, timeout: 10000 },
				);

				if (response.data?.success && response.data?.user) {
					localStorage.setItem("user", JSON.stringify(response.data.user));
					window.location.replace("/");
				} else {
					setIsTelegramWebApp(false);
				}
			} catch (error: any) {
				console.error("Telegram Web App auth error:", error);
				setIsTelegramWebApp(false);
			}
		};

		handleAutoLogin();
		const retries = [50, 150, 300];
		const timeouts = retries.map((delay) => setTimeout(handleAutoLogin, delay));
		return () => timeouts.forEach(clearTimeout);
	}, []);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const API_URL = import.meta.env.VITE_API_URL || "/api";
			const response = await axios.post(`${API_URL}/auth/login`, {
				telegramId: Number(telegramId),
				password,
			});

			if (response.data?.success && response.data?.user) {
				localStorage.setItem("user", JSON.stringify(response.data.user));
				window.location.href = "/";
			} else {
				setError("Invalid credentials");
			}
		} catch (error: any) {
			const errorData = error.response?.data;
			if (errorData?.needsPassword) {
				// User exists but has no password - redirect to set password
				window.location.href = `/set-password?telegramId=${telegramId}`;
			} else {
				setError(errorData?.error || "Login failed");
			}
		} finally {
			setLoading(false);
		}
	};

	// Don't show login form if in Telegram Web App
	if (isTelegramWebApp) {
		return (
			<div className="login-container">
				<div className="login-loading">
					<div className="login-spinner"></div>
					<p>Загрузка...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="login-container">
			<div className="login-panel">
				<div className="login-header">
					<p className="login-subtitle">Вход в систему</p>
				</div>

				<form onSubmit={handleLogin} className="login-form">
					<div className="login-input-group">
						<label htmlFor="telegramId">Telegram ID</label>
						<input
							id="telegramId"
							type="text"
							value={telegramId}
							onChange={(e) => setTelegramId(e.target.value)}
							placeholder="Введите ваш Telegram ID"
							required
							autoComplete="username"
						/>
						<p className="login-hint">
							Узнайте свой ID через бота: <code>/id</code>
						</p>
					</div>

					<div className="login-input-group">
						<label htmlFor="password">Пароль</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Введите пароль"
							required
							autoComplete="current-password"
						/>
					</div>

					{error && <div className="login-error">{error}</div>}

					<button type="submit" className="login-button" disabled={loading}>
						{loading ? "Вход..." : "Войти"}
					</button>
				</form>

				<div className="login-links">
					<Link to="/register" className="login-link">
						Регистрация
					</Link>
					<Link to="/forgot-password" className="login-link">
						Забыли пароль?
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Login;

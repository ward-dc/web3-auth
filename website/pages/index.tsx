import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useAuth } from "../providers/auth";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
	if (typeof window !== "undefined") {
		const ethereum = window.ethereum;
		if (ethereum) {
			console.log(ethereum);
		}
	}

	const { login, logout, user, authorized, cookiesAccepted, acceptCookies } = useAuth();
	console.log("cookiesAccepted",cookiesAccepted);
	function errHandler(message: string) {
		alert(message);
	}
	return (
		<>
			<p>{user?.address}</p>
			{!authorized && <button onClick={() => login(errHandler)}>connect wallet</button>}
			{authorized && <button onClick={() => logout()}>disconnect wallet</button>}
			{!cookiesAccepted && <button onClick={() =>{ acceptCookies()}}>accept cookies</button>}
		</>
	);
};

export default Home;

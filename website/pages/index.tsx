import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useAuth } from "../providers/auth";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
	const { login } = useAuth();
	function errHandler(message:string){
		alert(message);
	}
	return (
		<>
			<p></p>
			<button onClick={() => login(errHandler)}>connect wallet</button>
		</>
	);
};

export default Home;

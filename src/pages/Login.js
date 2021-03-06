import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext"

function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {setAuthState} = useContext(AuthContext);

    let history = useHistory();

    const login = () => {
        const data = {username: username, password: password};
        axios.post("https://full-stack-api-yonatan-ratner.herokuapp.com/user/login", data).then((response) => {
            if (response.data.error) {alert(response.data.error);}
            else {
                localStorage.setItem("accessToken", response.data.token);
                setAuthState({ username: response.data.username, id: response.data.id, status: true});
                history.push("/");
            }    
        });
    };

    return (
        <div className="loginContainer">      
            <label>Username: </label>
            <input type="text" onChange={(Event) => {setUsername(Event.target.value)}}/>

            <label>Password: </label>
            <input type="password" onChange={(Event) => {setPassword(Event.target.value)}}/>

            <button onClick={login}> Login</button>
        </div>
    ) 
}

export default Login;

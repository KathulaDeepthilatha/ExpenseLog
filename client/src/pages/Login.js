// import { useNavigate } from "react-router-dom";


// const Login = () => {
//     const navigate = useNavigate();
//     const handleLogin = () => {
//         navigate('/')
//     }
//     return (
//         <div>
//             <form>
//                 <label>
//                     Email:
//                     <input type="text" placeholder="enter your email.."></input>
//                 </label>
//                 <label>
//                     Password:
//                     <input type="password" placeholder="enter your password.."></input>
//                 </label>
//                 <label>
//                     <button onClick={handleLogin}>Login</button>
//                 </label>
//             </form>
//         </div>
//     )
// }

// export default Login;

import { Link } from "react-router-dom";
import Registration from "./Registration";
import { useNavigate } from "react-router-dom";



const Login = () => {
    const navigate = useNavigate();
    return (
        <div>
            <h2>Login Page</h2>
            <p>If not registered, please <span className="text-blue-500 font-semibold underline cursor-pointer" onClick={() => navigate("/registration")}>register</span> here.</p>
        </div>
    )
}

export default Login;
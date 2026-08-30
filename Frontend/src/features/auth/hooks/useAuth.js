// import { useContext, useEffect } from "react";
// import { AuthContext } from "../auth.context";
// import { login, register, logout, getMe } from "../services/auth.api";



// export const useAuth = () => {

//     const context = useContext(AuthContext)
//     const { user, setUser, loading, setLoading } = context


//     const handleLogin = async ({ email, password }) => {
//         setLoading(true)
//         try {
//             const data = await login({ email, password })
//             setUser(data.user)
//         } catch (err) {

//         } finally {
//             setLoading(false)
//         }
//     }

//     const handleRegister = async ({ username, email, password }) => {
//         setLoading(true)
//         try {
//             const data = await register({ username, email, password })
//             setUser(data.user)
//         } catch (err) {

//         } finally {
//             setLoading(false)
//         }
//     }

//     const handleLogout = async () => {
//         setLoading(true)
//         try {
//             const data = await logout()
//             setUser(null)
//         } catch (err) {

//         } finally {
//             setLoading(false)
//         }
//     }

//     useEffect(() => {

//         const getAndSetUser = async () => {
//             try {

//                 const data = await getMe()
//                 setUser(data.user)
//             } catch (err) { } finally {
//                 setLoading(false)
//             }
//         }

//         getAndSetUser()

//     }, [])

//     return { user, loading, handleRegister, handleLogin, handleLogout }
// }
import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext);
    const { user, setUser, loading, setLoading } = context;

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const data = await login({ email, password });
            if (data && data.user) {
                // Save user data locally to bypass cross-domain cookie blocks
                localStorage.setItem("user_session", JSON.stringify(data.user));
                setUser(data.user);
            }
        } catch (err) {
            console.error("Login failed:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        try {
            const data = await register({ username, email, password });
            if (data && data.user) {
                localStorage.setItem("user_session", JSON.stringify(data.user));
                setUser(data.user);
            }
        } catch (err) {
            console.error("Registration failed:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
        } catch (err) {
            console.error("Logout API failed, clearing local session:", err);
        } finally {
            localStorage.removeItem("user_session");
            setUser(null);
            setLoading(false);
        }
    };

    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                // 1. Try fetching from active backend api first
                const data = await getMe();
                if (data && data.user) {
                    setUser(data.user);
                    localStorage.setItem("user_session", JSON.stringify(data.user));
                } else {
                    throw new Error("No remote session");
                }
            } catch (err) {
                // 2. Fallback to local session storage if cookie domain matching drops out
                const localSession = localStorage.getItem("user_session");
                if (localSession) {
                    setUser(JSON.parse(localSession));
                }
            } finally {
                setLoading(false);
            }
        };

        getAndSetUser();
    }, []);

    return { user, loading, handleRegister, handleLogin, handleLogout };
};

import axios from "axios"


const api = axios.create({
    // baseURL: "http://localhost:3000",
    baseURL:"/api",
    withCredentials: true
})

export async function register({ username, email, password }) {

    try {
        const response = await api.post('/auth/register', {
            username, email, password
        })

        return response.data

    } catch (err) {

        console.log(err)

    }

}

export async function login({ email, password }) {

    try {

        const response = await api.post("/auth/login", {
            email, password
        })

        // return response.data
        const data = response.data;

// store token
localStorage.setItem("token", data.token || data.accessToken);

return data;

    } catch (err) {
        console.log(err)
    }

}

export async function logout() {
    try {

        const response = await api.get("/auth/logout")

        return response.data

    } catch (err) {

    }
}

export async function getMe() {

    try {


        const token = localStorage.getItem("token");

const response = await api.get("/auth/get-me", {
    headers: {
        Authorization: `Bearer ${token}`
    }
});

        return response.data

    } catch (err) {
        console.log(err)
    }

}
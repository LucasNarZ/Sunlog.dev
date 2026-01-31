"use client"

import { apiClient } from "@/lib/apiClient"
import { GoogleLogin } from "@react-oauth/google"

export default function GoogleButton() {
    return (
        <GoogleLogin
            onSuccess={async ({ credential }) => {
                await apiClient.post("/auth/login/google", { idToken: credential })
            }}
            onError={() => console.log("Login Error")}
        />
    )
}


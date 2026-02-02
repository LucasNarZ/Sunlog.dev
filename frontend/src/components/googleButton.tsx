"use client"

import { apiClient } from "@/lib/apiClient"
import { GoogleLogin } from "@react-oauth/google"
import { useRouter } from "next/navigation"


export default function GoogleButton() {
    const router = useRouter()
    return (
        <GoogleLogin
            onSuccess={async ({ credential }) => {
                const response = await apiClient.post("/auth/login/google", { idToken: credential })
                if (response.status == 200) {
                    router.push("/")
                }

            }}
            onError={() => console.log("Login Error")}
        />
    )
}


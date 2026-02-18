'use client'

import { GoogleOAuthProvider } from "@react-oauth/google"
import { CONFIG } from "@/config/constants"

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <GoogleOAuthProvider clientId={CONFIG.GOOGLE_CLIENT_ID}>
            {children}
        </GoogleOAuthProvider>
    )
}


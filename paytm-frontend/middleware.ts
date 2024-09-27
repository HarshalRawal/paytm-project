import NextAuth from "next-auth"
import authConfig from "./auth.config"    
const {auth} = NextAuth(authConfig)
export default auth((req)=>{
    const {nextUrl} = req
    const isLoggedIn = !!req.auth
  console.log(`Route = ${nextUrl.pathname} authentification = ${isLoggedIn}`)
})

export const config = {
    matcher: [
      // Skip Next.js internals and all static files, unless found in search params
      '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
      // Always run for API routes
      '/(api|trpc)(.*)',
    ],
  }
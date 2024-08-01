import { getServerSession } from "next-auth/next"
import { authOptions } from "../lib/auth"
import SocketProvider from "./SocketProvider"

export async function ServerSessionProvider({ children }) {
  const session = await getServerSession(authOptions)
  console.log({ session })

  return (
    <SocketProvider serverSession={session}>
      {children}
    </SocketProvider>
  )
}
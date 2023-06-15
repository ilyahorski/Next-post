import { getSession } from 'next-auth/react'
import { getToken } from 'next-auth/jwt'
import { getNode } from 'user.service'

const secret = process.env.NEXTAUTH_SECRET // our SECRET for encrypting/decrypting JWT (Next) token

export default async (req, res) => {
  const token = await getToken({ req, secret }) // get JWT token from request
  const session = await getSession({ req }) // check if session exists

  const node = await getNode(token.account.access_token); // attach `access_token` to Drupal request
  if (session) {
    res.send({ content: node })
  } else {
    res.send({ error: 'You must be sign in to view the protected content on this page.' })
  }
}
// server/api/auth/[...].ts
import CredentialsProvider from 'next-auth/providers/credentials'
import { NuxtAuthHandler } from '#auth'

export default NuxtAuthHandler({
  // A secret string you define, to ensure correct encryption
  secret: process.env.NUXT_SECRET, // Make sure to set this in your .env file
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    CredentialsProvider.default({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: '(hint: admin)' },
        password: { label: 'Password', type: 'password', placeholder: '(hint: password)' }
      },
      async authorize(credentials: any) {
        // In a real application, you'd check the credentials against your database
        const user = { id: '1', name: 'Admin', username: 'admin', password: 'password' }
        
        if (credentials?.username === user.username && credentials?.password === user.password) {
          return user
        } else {
          console.error('Warning: Malicious login attempt registered, bad credentials provided')
          return null
        }
      }
    })
  ]
})
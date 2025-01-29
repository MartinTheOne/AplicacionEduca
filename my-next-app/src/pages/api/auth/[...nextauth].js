import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "../../../lib/mongodb";

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            try {
                const client = await clientPromise;
                const db = client.db("proyecto_educa");
                const authorizeUser = await db.collection("authorized_user").findOne({ email: user.email });
                if(authorizeUser){
                    user.role=authorizeUser.role||"user";
                }
                return !!authorizeUser;
            } catch (error) {
                console.error("Error en signIn:", error);
                return false;
            }
        },
        async jwt({ token,user, account }) {
            if (account) {
                token.accessToken = account.access_token;
            }
            if(user){
                token.role=user.role;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.image=token.picture||session.user.image
            session.user.token = token.accessToken;
            session.user.role=token.role;
            return session;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60,
    },
    pages: {
        signIn: '/login',
        signOut: '/login',
        error: '/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
});
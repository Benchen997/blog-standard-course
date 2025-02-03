import { getSession } from '@auth0/nextjs-auth0';
import clientPromise  from '../../lib/mongodb';

export default async function handler(req, res) {
    // 1. grab current login user
    const { user } = await getSession(req, res);
    const client = await clientPromise;
    const db = client.db("BlogStandard");
    // 2. update user profile with tokens, if user does not exist, create one
    const userProfile = db.collection("users").updateOne(
        { auth0Id: user.sub },
        {
            $inc: { availableTokens: 10 },
            $setOnInsert: { auth0Id: user.sub }
        },
        { upsert: true }
    )
    res.status(200).json({ message: "Tokens added" });
}
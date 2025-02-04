import OpenAI from "openai";
import {getSession, withApiAuthRequired} from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";

export default withApiAuthRequired (async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db("BlogStandard");
    const { user } = await getSession(req, res);

    const userProfile = await db.collection("users").findOne({ auth0Id: user.sub });
    if (!userProfile?.availableTokens) {
       return res.status(403);
    }




    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const { topic, keywords } = req.body;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are an SEO-friendly blog post author called BlogStandard, you are designed to output markdown without frontmatter." },
                { role: "user", content: `
                    Generate a blog post on the following topic:
                    ---
                    ${topic}
                    ---
                    Targeting the following comma-separated keywords:
                    ---
                    ${keywords}
                    ---
                ` },
            ],
        });
        const postContent = response.choices[0]?.message?.content;

        const seoResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are an SEO-friendly blog post author called BlogStandard, you are designed to output JSON, " +
                        "DO NOT include HTML tags in your output" },
                { role: "user", content: `
                    Generate an SEO-friendly blog title and SEO friendly meta description based on the following content:
                    ---
                    ${postContent}
                    ---
                    the example output should be in the following format:
                    ---
                    {
                        "title": "SEO-friendly title",
                        "metaDescription": "SEO-friendly meta description"
                    }
                ` },
            ],
            response_format: {
                type: "json_object",
            }
        });
        // default to empty strings if the response is not as expected
        let title = "";
        let metaDescription = "";
        try {
            const seoData = JSON.parse(seoResponse.choices[0]?.message?.content || "{}");
            title = seoData.title || "";
            metaDescription = seoData.metaDescription || "";
        } catch (error) {
            console.error("Failed to parse SEO response:", error);
        }

        await db.collection("users").updateOne(
            { auth0Id: user.sub },
            { $inc: { availableTokens: -1 } }
        )

        const post = await db.collection("posts").insertOne({
            postContent,
            title,
            metaDescription,
            topic,
            keywords,
            userId: userProfile._id,
            createdAt: new Date(),
        });

        res.status(200).json({
            postId: post.insertedId,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate post' });
    }
});
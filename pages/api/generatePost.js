import OpenAI from "openai";

export default async function handler(req, res) {
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
        const { title, metaDescription } = seoResponse.choices[0]?.message?.content || {};

        res.status(200).json({
            post :{
                postContent,
                title,
                metaDescription
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate post' });
    }
}
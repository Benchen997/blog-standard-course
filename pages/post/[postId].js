import React from 'react'
import {getSession, withPageAuthRequired} from "@auth0/nextjs-auth0";
import {AppLayout} from "../../components";
import clientPromise from "../../lib/mongodb";
import {ObjectId} from "mongodb";
import Markdown from "react-markdown";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHashtag} from "@fortawesome/free-solid-svg-icons";
import {getAppProps} from "../../utils/getAppProps";

export default function PostID (props) {
  return (
    <div className={"overflow-auto h-full"}>
        <section className={"max-w-screen-sm mx-auto"}>
            <div className={"text-sm font-bold mt-6 p-2 bg-stone-200 rounded-md"}>
                SEO title and meta description:
            </div>

            <div className={"p-4 my-2 border-stone-200 rounded-md"}>
                <div className={"text-blue-600 text-2xl font-bold"}>
                    {props.title || "No title"}
                </div>
                <div className={"mt-2"}>
                    {props.metaDescription}
                </div>
                <div className={"flex flex-wrap pt-2 gap-1"}>
                    {props.keywords.split(",").map((keyword, index) => (
                        <div key={index} className={"p-2 bg-slate-800 text-white rounded-full"}>
                           <FontAwesomeIcon icon={faHashtag}/> {keyword}
                        </div>
                    ))}
                </div>
            </div>
            <div className={"text-sm font-bold mt-6 p-2 bg-stone-200 rounded-md"}>
                Blog Post
            </div>
            <Markdown>
                {props.postContent || "No content"}
            </Markdown>
        </section>
    </div>
  )
}

PostID.getLayout = function getLayout(page, pageProps) {
  return (
      <AppLayout {...pageProps}
      >{page}</AppLayout>
  );
}

export const getServerSideProps = withPageAuthRequired({
    async getServerSideProps(ctx) {
        const props = await getAppProps(ctx);
      const userSession  = await getSession(ctx.req, ctx.res);
      const client = await clientPromise;
        const db = client.db("BlogStandard");
        const user = await db.collection("users").findOne({ auth0Id: userSession.user.sub });
        const post = await db.collection("posts").findOne(
            {
                _id: new ObjectId(ctx.params.postId),
                userId: user._id
              });
        if (!post) {
            return {
                redirect: {
                    destination: "/[post/new",
                    permanent: false
                }
            }
        }
        return {
            props: {
                postContent: post.postContent,
                title: post.title,
                keywords: post.keywords,
                metaDescription: post.metaDescription,
                topic: post.topic,
                ...props
            }
        }
      }
});
import React from 'react'
import {withPageAuthRequired} from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components";
import {useRouter} from "next/navigation";
import {getAppProps} from "../../utils/getAppProps";

export default function NewPost() {
    const [topic , setTopic] = React.useState('');
    const [keywords , setKeywords] = React.useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/generatePost',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ topic, keywords })
        });
        const { postId } = await response.json();
        if (postId) {
            router.push(`/post/${postId}`);
        }

    }
  return (
      <div className={"flex w-full justify-center items-center h-screen"}>
          <form onSubmit={handleSubmit} className={"p-4 w-4/5 mx-auto"}>
              <div>
                  <label>
                      <strong>
                          Generate a blog post on the topic of :
                      </strong>
                  </label>
                  <textarea className={"resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"} value={topic} onChange={(e)=> setTopic(e.target.value)}/>
              </div>
              <div>
                  <label>
                      <strong>
                          Targeting the following keywords:
                      </strong>
                  </label>
                  <textarea className={"resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"} value={keywords} onChange={(e)=> setKeywords(e.target.value)}/>
              </div>
              <button type={"submit"} className={"btn"}>
                  Generate
              </button>
          </form>
      </div>
  )
}

NewPost.getLayout = function getLayout(page, pageProps) {
    return (
        <AppLayout {...pageProps}
        >{page}</AppLayout>
    );
}

// This function gets called at build time, and then again at each request, passing the context object.
export const getServerSideProps = withPageAuthRequired({
    async getServerSideProps(ctx) {
        const props = await getAppProps(ctx);
        return { props };
    }
});


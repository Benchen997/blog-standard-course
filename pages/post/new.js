import React from 'react'
import {withPageAuthRequired} from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components";
import Markdown from 'react-markdown';

export default function NewPost() {
    const [topic , setTopic] = React.useState('');
    const [keywords , setKeywords] = React.useState('');
    const [post , setPost] = React.useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/generatePost',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ topic, keywords })
        });
        const data = await response.json();
        setPost(data.post.postContent);
    }
  return (
      <div>
          <form onSubmit={handleSubmit}>
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
                <div className={"my-4"}>
                    <h2>Generated Post:</h2>
                    <Markdown>
                        {post}
                    </Markdown>
                </div>
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
export const getServerSideProps = withPageAuthRequired(async () => {
  return {
    props: {},
  }
});


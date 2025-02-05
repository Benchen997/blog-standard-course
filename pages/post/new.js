import React from 'react'
import {withPageAuthRequired} from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components";
import {useRouter} from "next/navigation";
import {getAppProps} from "../../utils/getAppProps";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBrain} from "@fortawesome/free-solid-svg-icons";

export default function NewPost() {
    const [topic , setTopic] = React.useState('');
    const [keywords , setKeywords] = React.useState('');
    const [generating, setGenerating] = React.useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGenerating(true);
        try {
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
        } catch (e) {
            console.error(e);
            setGenerating(false);
        }

    }
  return (
      <div className={"h-full overflow-hidden"}>
          {!!generating && (
          <div className={"text-green-500 flex h-full animate-pulse w-full flex-col justify-center items-center"}>
              <FontAwesomeIcon icon={faBrain} className={"text-8xl"}/>
              <h6>Generating ... </h6>
          </div>
            )}
            {!generating && (
          <div className={"w-full h-full flex flex-col overflow-auto"}>
              <form onSubmit={handleSubmit} className={"m-auto w-full max-w-screen-sm bg-slate-100 p-4 " +
                  "rounded-md shadow-lg border border-slate-200 shadow-slate-100"}>
                  <div>
                      <label>
                          <strong>
                              Generate a blog post on the topic of :
                          </strong>
                      </label>
                      <textarea className={"resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"}
                                value={topic} onChange={(e) => setTopic(e.target.value)}/>
                  </div>
                  <div>
                      <label>
                          <strong>
                              Targeting the following keywords:
                          </strong>
                      </label>
                      <textarea className={"resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"}
                                value={keywords} onChange={(e) => setKeywords(e.target.value)}/>
                      <small className={"block mb-2"}>
                            Separate keywords with commas
                      </small>
                  </div>
                  <button type={"submit"} className={"btn"}>
                      Generate
                  </button>
              </form>
          </div>
            )}
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
        if (!props.availableTokens) {
            return {
                redirect: {
                    destination: '/token-topup',
                    permanent: false
                }
            }
        }
        return { props };
    }
});


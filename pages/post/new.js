import React from 'react'
import {withPageAuthRequired} from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components";

export default function NewPost() {
  return (
      <div> NewPost</div>
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


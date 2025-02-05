import React from 'react'
import {withPageAuthRequired} from "@auth0/nextjs-auth0";
import {AppLayout} from "../components";
import {getAppProps} from "../utils/getAppProps";

export default function TokenTopup() {
    const handleClick = async () => {
        const response = await fetch('/api/addTokens', {
            method: 'POST',
        });
        const data = await response.json();
        window.location.href = data.session.url;
    }
  return (
    <div>TokenTopup
        <button className={"btn"} onClick={handleClick}>Add tokens</button>
    </div>
  )
}

TokenTopup.getLayout = function getLayout(page, pageProps) {
    return (
        <AppLayout {...pageProps}>{page}</AppLayout>
    )
}

export const getServerSideProps = withPageAuthRequired({
    async getServerSideProps(ctx) {
        const props = await getAppProps(ctx);
        return { props };
    }
});

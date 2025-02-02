import React from 'react'
import {withPageAuthRequired} from "@auth0/nextjs-auth0";

export default function PostID () {
  return (
    <div> PostID </div>
  )
}
export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {},
  }
});
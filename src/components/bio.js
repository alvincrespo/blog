import React from "react"
import { useStaticQuery, graphql } from "gatsby"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
        childImageSharp {
          fixed(width: 50, height: 50) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          social {
            twitter
          }
        }
      }
    }
  `)

  const { social } = data.site.siteMetadata
  return (
    <>
      <p className="text-md">
        Authored by{" "}
        <a
          className="font-bold text-lg"
          href={`https://twitter.com/${social.twitter}`}
        >
          @alvincrespo
        </a>
        . Need Help? Want to chat?{" "}
        <a className="font-bold text-lg" href="https://alvincrespo.com/contact">
          Contact me.
        </a>
      </p>
    </>
  )
}

export default Bio

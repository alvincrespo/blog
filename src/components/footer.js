import React from "react"
import TwitterSVG from "../images/twitter.svg"
import GithubSVG from "../images/github.svg"
import LinkedInSVG from "../images/linkedin.svg"

const Footer = () => (
  <footer className="text-center my-2 p-4">
    <p className="my-4">
      © {new Date().getFullYear()}, Designed and Developed by
      {` `}
      <a
        href="https://twitter.com/alvincrespo"
        target="_blank"
        rel="noopener noreferrer"
        className="text-deeppink"
      >
        @alvincrespo
      </a>
      .
    </p>
    <p className="flex justify-center">
      <a
        href="https://twitter.com/alvincrespo"
        target="_blank"
        rel="noopener noreferrer"
        className="mr-4 w-5 h-5"
      >
        <img src={TwitterSVG} alt="twitter" />
      </a>
      <a
        href="https://github.com/alvincrespo"
        target="_blank"
        rel="noopener noreferrer"
        className="mr-4 w-5 h-5"
      >
        <img src={GithubSVG} alt="github" />
      </a>
      <a
        href="https://www.linkedin.com/in/alvincrespo"
        target="_blank"
        rel="noopener noreferrer"
        className="mr-4 w-5 h-5"
      >
        <img src={LinkedInSVG} alt="linkedin" />
      </a>
    </p>
  </footer>
)

export default Footer

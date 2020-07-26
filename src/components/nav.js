import React from "react"
import { Link } from "gatsby"

const Nav = ({ prefix }) => {
  return (
    <div className="flex w-full p-4">
      {prefix}
      <nav>
        <a
          href="https://alvincrespo.com/resume"
          target="_blank"
          rel="noopener noreferrer"
          className="uppercase"
        >
          Resume
        </a>
        <Link className="ml-4 uppercase text-deeppink" to="/">
          Blog
        </Link>
        <a
          href="https://alvincrespo.com/testimonials"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-4 uppercase"
        >
          Testimonials
        </a>
        <a
          href="https://alvincrespo.com/testimonials"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-4 uppercase"
        >
          Contact
        </a>
      </nav>
    </div>
  )
}

export default Nav

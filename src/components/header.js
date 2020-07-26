import React from "react"
import Nav from "./nav"

const Header = () => (
  <>
    <Nav
      prefix={
        <span className="flex mr-4">
          <h1 className="mr-2">
            <a
              href="https://alvincrespo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base uppercase leading-none hover:text-cyan tracking-tight"
            >
              Alvin Crespo
            </a>
          </h1>
          <span>{`//`}</span>
        </span>
      }
    />
  </>
)

export default Header

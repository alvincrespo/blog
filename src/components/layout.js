import React from "react"
import Header from "./header"
import Bio from "../components/bio"
import "../styles/global.css"

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col items-center">
      <Header />
      <main className="w-full max-w-screen-lg">{children}</main>
      <footer>
        <Bio />
      </footer>
    </div>
  )
}

export default Layout

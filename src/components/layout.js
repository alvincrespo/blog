import React from "react"
import { Link } from "gatsby"
import Bio from "../components/bio"
import "./layout.css"

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`
    const isRootPath = location.pathname === rootPath

    return (
      <div className="p-6 border-3">
        <header className="mb-6">
          <h1
            className={
              isRootPath ? "text-2xl sm:text-4xl" : "text-xl sm:text-2xl"
            }
          >
            <Link to={`/`}>{title}</Link>
          </h1>
        </header>
        <main className="max-w-3xl">{children}</main>
        <footer>
          <Bio />
        </footer>
      </div>
    )
  }
}

export default Layout

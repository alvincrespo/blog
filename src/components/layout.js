import React from "react"
import { Link } from "gatsby"
import Bio from "../components/bio"
import "./layout.css"

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props

    return (
      <>
        <Header
          location={location}
          render={() => (
            <h1>
              <Link to={`/`}>{title}</Link>
            </h1>
          )}
        />
        <main>{children}</main>
        <footer>
          <Bio />
        </footer>
      </>
    )
  }
}

const Header = ({ location, render = () => {} }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  const headerClassNames = [isRootPath ? "text-3xl" : "text-2xl"]
  return <header className={headerClassNames}>{render()}</header>
}

export default Layout

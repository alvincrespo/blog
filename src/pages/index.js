import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="All posts" />
        <div className="my-6">
          <section class="mb-6">
            <h2 class="text-5xl tracking-tight leading-none uppercase">
              Alvin Crespo // Blog
            </h2>
          </section>
          {posts.map(({ node }) => {
            const title = node.frontmatter.title || node.fields.slug
            return (
              <article key={node.fields.slug} className="p-4 my-6">
                <header className="flex flex-row items-center mb-4">
                  <h2 className="text-3xl sm:text-4xl leading-none text-deeppink">
                    <Link to={node.fields.slug}>{title}</Link>
                    <span
                      className="opacity-0 rocket text-2xl ml-4 "
                      role="img"
                      aria-label="Rocket"
                    >
                      🚀
                    </span>
                  </h2>
                </header>
                <section>
                  <p
                    className="text-md"
                    dangerouslySetInnerHTML={{
                      __html: node.frontmatter.description || node.excerpt,
                    }}
                  />
                </section>
              </article>
            )
          })}
        </div>
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`

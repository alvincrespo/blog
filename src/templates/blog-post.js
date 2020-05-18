import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title
    const { previous, next } = this.props.pageContext

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title={post.frontmatter.title}
          description={post.frontmatter.description || post.excerpt}
        />
        <article className="post" id="top">
          <header className="mb-4">
            <h2 className="text-4xl">{post.frontmatter.title}</h2>
            <small>{post.frontmatter.date}</small>
          </header>
          <section dangerouslySetInnerHTML={{ __html: post.html }} />
          <hr />
          <a className="to-top" href="#top">
            Jump to top of page
          </a>
        </article>

        <nav className="my-4 post-nav">
          <ul className="flex flex-col sm:flex-row justify-between items-center sm:items-start">
            <li className="flex flex-row mb-2">
              ←
              {previous && (
                <Link
                  to={previous.fields.slug}
                  rel="prev"
                  className="block truncate w-64 ml-2 text-left"
                >
                  {previous.frontmatter.title}
                </Link>
              )}
            </li>
            <li className="flex flex-row">
              {next && (
                <Link
                  to={next.fields.slug}
                  rel="next"
                  className="block truncate w-64 mr-2 text-right"
                >
                  {next.frontmatter.title}
                </Link>
              )}
              →
            </li>
          </ul>
        </nav>
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
  }
`

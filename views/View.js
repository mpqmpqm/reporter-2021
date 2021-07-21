import Head from "next/head"
import styled, { css } from "styled-components"

const maxTitleLength = 25

const Container = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
`

const Header = styled.header`
  margin-bottom: 1rem;
  padding: 8px 12px 0 14px;

  & h1,
  h2 {
    text-align: right;
    word-break: break-word;
    user-select: none;
  }

  & h1 {
    font-size: 1.8rem;
    line-height: 1.1;
    color: #666;
  }

  & h2 {
    text-align: right;
    font-size: 3.4rem;
    line-height: 1;
  }
`

const View = ({ pageTitle, children, id, className }) => {
  if (pageTitle.length > maxTitleLength)
    pageTitle = pageTitle.slice(0, maxTitleLength).trim().concat(`...`)
  return (
    <>
      <Head>
        <title>Reporter{pageTitle && ` | ${pageTitle}`}</title>
      </Head>
      <Container className={className} id={id}>
        <Header>
          <h1>Reporter</h1>
          <h2>{pageTitle}</h2>
        </Header>
        {children}
      </Container>
    </>
  )
}

export default View

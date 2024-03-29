import Head from "next/head"

const maxTitleLength = 25

const View = ({ pageTitle, children, id, className }) => {
  if (pageTitle.length > maxTitleLength)
    pageTitle = pageTitle.slice(0, maxTitleLength).trim().concat(`...`)
  return (
    <>
      <Head>
        <title>Reporter{pageTitle && ` | ${pageTitle}`}</title>
      </Head>
      <div className={`View${className ? ` ${className}` : ``}`} id={id}>
        <header>
          <h1>Reporter</h1>
          <h2>{pageTitle}</h2>
        </header>
        {children}
      </div>
    </>
  )
}

export default View

const maxTitleLength = 25

const View = ({ pageTitle, children, id }) => {
  if (pageTitle.length > maxTitleLength)
    pageTitle = pageTitle.slice(0, maxTitleLength).trim().concat(`...`)
  return (
    <div className="View" id={id}>
      <header>
        <h1>Reporter</h1>
        <h2>{pageTitle}</h2>
      </header>
      {children}
    </div>
  )
}

export default View

const View = ({ pageTitle, children, id }) => {
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

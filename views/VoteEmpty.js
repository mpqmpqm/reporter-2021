import { Link } from "react-router-dom"
import View from "./View"

const VoteEmpty = () => {
  return (
    <View id="Vote" pageTitle="">
      <p
        style={{
          textAlign: `center`,
          fontSize: 24,
          width: `95%`,
          margin: `0 auto`,
        }}
      >
        No data 🔍 Create a board in{" "}
        <Link
          to="/settings"
          style={{ color: `var(--nav-color)`, textDecoration: `underline` }}
        >
          Settings
        </Link>
      </p>
    </View>
  )
}

export default VoteEmpty

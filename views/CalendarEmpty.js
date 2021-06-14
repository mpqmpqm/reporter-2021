import { Link } from "react-router-dom"
import View from "./View"

const CalendarEmpty = () => {
  return (
    <View id="Calendar" pageTitle="Calendar">
      <p style={{ textAlign: `center`, fontSize: 24, marginTop: `1em` }}>
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

export default CalendarEmpty

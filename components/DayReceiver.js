import { forwardRef, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import DayContentful from "./DayContentful"
import DayEmpty from "./DayEmpty"

const GridItem = styled.div`
  width: 100%;
  position: relative;
  padding-top: 100%;
  ${(props) =>
    props.primary &&
    css`
      background: palevioletred;
      color: white;
    `};

  > * {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: block;
  }

  p {
    color: #666;
    font-size: 8px;
    transform: translateX(-4px);
  }

  svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: block;
    transform: rotateZ(180deg);

    &.empty {
      fill: rgb(32, 32, 32);
    }
  }
`

const SVGClipContainer = styled.div`
  clip-path: circle(47.5%);
  transform-origin: center;
`

const TodayGraph = styled.div`
  flex-grow: 1;
  grid-area: all;
  display: flex;
  flex-direction: column;

  svg {
    display: block;
    width: 100%;
    height: 100%;
    transform: rotateZ(180deg);
  }
`

const DayReceiver = forwardRef(
  (
    {
      day,
      year,
      month,
      data,
      emojiList,
      colorDict,
      startOfMonth = false,
      calendar,
      binary,
    },
    ref
  ) => {
    const reports =
      data &&
      (({ createdAt, ...props }) =>
        Object.keys(props).length
          ? {
              ...props,
            }
          : null)(data)

    const totalReports =
      reports && Object.values(reports).reduce((sum, count) => sum + count, 0)

    const contentful = !!totalReports

    const svgContainer = useRef(null)

    useEffect(() => {
      if (ref && svgContainer && ref.current && svgContainer.current) {
        svgContainer.current.style.height = `${
          ref.current.getBoundingClientRect().height
        }px`
      }
    })

    return calendar ? (
      <GridItem style={{ gridColumnStart: startOfMonth && startOfMonth + 1 }}>
        <p>{day}</p>
        <SVGClipContainer ref={svgContainer}>
          {contentful ? (
            <Link
              to={`/calendar/${year}/${month}/${day}`}
              key={year + month + day}
            >
              <DayContentful
                {...{
                  reports,
                  totalReports,
                  emojiList,
                  colorDict,
                  calendar,
                  day,
                  month,
                  year,
                  binary,
                }}
                ref={svgContainer}
              />
            </Link>
          ) : (
            <DayEmpty ref={svgContainer} binary={binary} />
          )}
        </SVGClipContainer>
      </GridItem>
    ) : (
      <TodayGraph ref={svgContainer}>
        {contentful ? (
          <DayContentful
            ref={ref}
            {...{
              reports,
              totalReports,
              emojiList,
              colorDict,
              calendar,
              binary,
            }}
          />
        ) : (
          <DayEmpty binary={binary} />
        )}
      </TodayGraph>
    )
  }
)

export default DayReceiver

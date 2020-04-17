import React from "react"
import ContentLoader from "react-content-loader" 

const LotLoader = () => (
  <ContentLoader 
    speed={2}
    width={400}
    height={475}
    viewBox="0 0 400 475"
    backgroundColor="#bdbdbd"
    foregroundColor="#dadcdd"
  >
    <rect x="-149" y="-167" rx="2" ry="2" width="452" height="452" />
  </ContentLoader>
)

export default LotLoader
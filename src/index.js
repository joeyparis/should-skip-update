import get from 'lodash/get'

const shouldSkipUpdate = (watched_props) => (prevProps, nextProps) => watched_props.every((prop) => get(prevProps, prop) === get(nextProps, prop))

export default shouldSkipUpdate

const StatusTag = ({ type, text }) => {
  return <div className={`status-tag ${type}`}>{text}</div>
}

export default StatusTag
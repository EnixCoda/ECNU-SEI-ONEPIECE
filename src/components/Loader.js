import React from 'react'

export default function Loader() {
  return (
    <div className="loading-placeholder zoom">
      <div className="round flex-center" style={{background: '#2196f3', boxSizing: 'border-box'}}>
        <div className="round" style={{transform: 'scale(0.8)', background: '#fafafa'}}>
        </div>
      </div>
    </div>
  )
}

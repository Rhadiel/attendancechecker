import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import RaffleWheel from './RaffleWheel'
import './Attendance.css'

function Attendance() {
  const [attendees, setAttendees] = useState([])
  const [search, setSearch] = useState('')
  const [showRaffle, setShowRaffle] = useState(false)

  const fetchAttendees = async () => {
    const { data } = await supabase.from('attendees').select('*')
    setAttendees(data)
  }

  const markPresent = async (id) => {
    await supabase.from('attendees').update({ is_present: true }).eq('id', id)
    fetchAttendees()
  }

  const resetAttendance = async (id) => {
    await supabase.from('attendees').update({ is_present: false }).eq('id', id)
    fetchAttendees()
  }

  useEffect(() => {
    fetchAttendees()
  }, [])
  const filteredAttendees = attendees
  .filter(a => a.name.toLowerCase().includes(search.toLowerCase()))
  .sort((a, b) => {
    if (a.is_present === b.is_present) return 0
    return a.is_present ? -1 : 1
  })


  const presentCount = attendees.filter(a => a.is_present).length
  const absentCount = attendees.length - presentCount

  return (
    <div className="container">
      {!showRaffle && <h1>🎉Batch 2015 Event Attendance</h1>}
  
      {/* Attendance Table */}
      {!showRaffle && (
        <div className="layout">
          <div className="left-column">
            <div className="top-bar">
              <input
                className="search-input"
                type="text"
                placeholder="🔍 Search attendee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="counter">
                <div>✅ Present: <span>{presentCount}</span></div>
                <div>🕒 Not Yet Arrived: <span>{absentCount}</span></div>
              </div>
              <button
                className="raffle-toggle-btn"
                onClick={() => setShowRaffle(true)}
              >
                🎊 Go to Raffle Wheel
              </button>
            </div>
  
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendees.map(a => (
                  <tr key={a.id}>
                    <td>{a.name}</td>
                    <td>{a.is_present ? '✅ Present' : '🕒 Not Yet Arrived'}</td>
                    <td>
                      {!a.is_present ? (
                        <button className="present-btn" onClick={() => markPresent(a.id)}>Mark Present</button>
                      ) : (
                        <button className="reset-btn" onClick={() => resetAttendance(a.id)}>Undo</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
  
      {/* Raffle Wheel */}
      {showRaffle && (
        <RaffleWheel
          attendees={attendees.filter(a => a.is_present)}
          onWinnerPicked={fetchAttendees}
          onBack={() => setShowRaffle(false)}
        />
      )}
    </div>
  )
}

export default Attendance

import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { Wheel } from 'react-custom-roulette'
import './RaffleWheel.css'

function RaffleWheel({ onWinnerPicked, onBack }) {
  const [mustSpin, setMustSpin] = useState(false)
  const [prizeNumber, setPrizeNumber] = useState(0)
  const [participants, setParticipants] = useState([])
  const [winnerName, setWinnerName] = useState('')

  // Fetch participants who are present and have not won
  const fetchParticipants = async () => {
    const { data, error } = await supabase
      .from('attendees')
      .select('*')
      .eq('is_present', true)  // Ensure that only present attendees are considered
      .eq('has_won', false)   // Ensure that only attendees who haven't won yet are included

    if (error) console.error(error)
    else setParticipants(data)
  }

  useEffect(() => {
    fetchParticipants()
  }, [onWinnerPicked]) // Refetch the participants when a new winner is picked

  const data = participants.map(a => ({ option: a.name }))

  const handleSpinClick = () => {
    if (participants.length === 0) return alert('No more names in the raffle!')
    const newPrizeNumber = Math.floor(Math.random() * participants.length)
    setPrizeNumber(newPrizeNumber)
    setMustSpin(true)
  }

  const handleStopSpinning = async () => {
    const winner = participants[prizeNumber]
    setWinnerName(winner.name)

    // Mark the winner as "has_won" in the database
    const { error } = await supabase
      .from('attendees')
      .update({ has_won: true })
      .eq('id', winner.id)

    if (error) console.error(error)

    setMustSpin(false)
    onWinnerPicked()
    fetchParticipants()
  }

  const resetRaffle = async () => {
    // Reset the has_won column to false for all attendees (whether they won or not)
    const { error } = await supabase
      .from('attendees')
      .update({ has_won: false })
      .eq('is_present', true)  // Ensure we're only affecting present attendees

    if (error) console.error(error)

    // Fetch all participants again, including those who were marked as winners
    fetchParticipants()
    onWinnerPicked() // Refresh the attendance list
    setWinnerName('') // Clear the winner's name
  }

  const closeWinnerModal = () => {
    setWinnerName('')
  }

  return (
    <div>
      <div className="raffle-container">
        <h3>🎊 Batch 2015 Raffle Wheel</h3>

        {participants.length > 0 ? (
          <>
            <Wheel
              mustStartSpinning={mustSpin}
              prizeNumber={prizeNumber}
              data={data}
              backgroundColors={['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0']}
              textColors={['#fff']}
              onStopSpinning={handleStopSpinning}
              fontSize={16}
            />
            <button className="spin-btn" onClick={handleSpinClick}>
              🎰 Spin!
            </button>
          </>
        ) : (
          <p>No more names!</p>
        )}

        <div className="button-group">
          <button className="reset-btn" onClick={resetRaffle}>
            ♻️ Reset Raffle
          </button>
          <button className="back-btn" onClick={onBack}>
            ⬅️ Back to Attendance
          </button>
        </div>
      </div>

      {/* Winner Modal */}
      {winnerName && (
        <div className="winner-modal">
          <div className="winner-card">
            <h2>🎉 Winner!</h2>
            <p>{winnerName}</p>
            <button className="close-btn" onClick={closeWinnerModal}>
              🎉 OK
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default RaffleWheel

import React, { useState } from 'react';
import './Polls.css';

const mockPolls = [
  {
    id: 1,
    question: 'Do you prefer offline exams?',
    options: ['Yes', 'No', 'Hybrid'],
    votes: [45, 30, 25],
    totalVotes: 100,
    active: true,
    createdBy: 'Admin'
  },
  {
    id: 2,
    question: 'How satisfied are you with the cafeteria food?',
    options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'],
    votes: [20, 35, 25, 20],
    totalVotes: 100,
    active: true,
    createdBy: 'Admin'
  }
];

const Polls = () => {
  const [polls, setPolls] = useState(mockPolls);
  const [role, setRole] = useState('student');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPoll, setNewPoll] = useState({
    question: '',
    options: ['', '']
  });

  const handleCreatePoll = (e) => {
    e.preventDefault();
    const poll = {
      id: Date.now(),
      question: newPoll.question,
      options: newPoll.options.filter(opt => opt.trim()),
      votes: new Array(newPoll.options.filter(opt => opt.trim()).length).fill(0),
      totalVotes: 0,
      active: true,
      createdBy: 'Admin'
    };
    setPolls([poll, ...polls]);
    setNewPoll({ question: '', options: ['', ''] });
    setShowCreateForm(false);
  };

  const handleVote = (pollId, optionIndex) => {
    setPolls(polls.map(poll => {
      if (poll.id === pollId) {
        const newVotes = [...poll.votes];
        newVotes[optionIndex]++;
        return {
          ...poll,
          votes: newVotes,
          totalVotes: poll.totalVotes + 1
        };
      }
      return poll;
    }));
  };

  const addOption = () => {
    setNewPoll({ ...newPoll, options: [...newPoll.options, ''] });
  };

  const removeOption = (index) => {
    if (newPoll.options.length > 2) {
      setNewPoll({
        ...newPoll,
        options: newPoll.options.filter((_, i) => i !== index)
      });
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...newPoll.options];
    newOptions[index] = value;
    setNewPoll({ ...newPoll, options: newOptions });
  };

  return (
    <div className="polls-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Polls & Feedback</h2>
        <button className="btn btn-secondary" onClick={() => setRole(role === 'student' ? 'admin' : 'student')}>
          Switch to {role === 'student' ? 'Admin' : 'Student'} View
        </button>
      </div>
      
      {role === 'admin' ? (
        <div className="admin-polls">
          <button className="btn btn-primary" onClick={() => setShowCreateForm(true)}>
            Create New Poll
          </button>
          
          {showCreateForm && (
            <div className="create-poll-form">
              <h3>Create New Poll</h3>
              <form onSubmit={handleCreatePoll}>
                <div className="form-group">
                  <label>Question</label>
                  <input
                    type="text"
                    value={newPoll.question}
                    onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Options</label>
                  {newPoll.options.map((option, index) => (
                    <div key={index} className="option-input">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        required
                      />
                      {newPoll.options.length > 2 && (
                        <button type="button" onClick={() => removeOption(index)} className="remove-btn">
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={addOption} className="add-option-btn">
                    + Add Option
                  </button>
                </div>
                <div className="form-actions">
                  <button type="button" onClick={() => setShowCreateForm(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Poll
                  </button>
                </div>
              </form>
            </div>
          )}
          
          <div className="polls-list">
            <h3>All Polls</h3>
            {polls.map(poll => (
              <div key={poll.id} className="poll-card">
                <h4>{poll.question}</h4>
                <div className="poll-results">
                  {poll.options.map((option, index) => {
                    const percentage = poll.totalVotes > 0 ? (poll.votes[index] / poll.totalVotes) * 100 : 0;
                    return (
                      <div key={index} className="poll-option">
                        <div className="option-info">
                          <span>{option}</span>
                          <span>{poll.votes[index]} votes ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="poll-meta">
                  Total votes: {poll.totalVotes} | Created by: {poll.createdBy}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="student-polls">
          <h3>Active Polls</h3>
          {polls.filter(poll => poll.active).map(poll => (
            <div key={poll.id} className="poll-card">
              <h4>{poll.question}</h4>
              <div className="poll-options">
                {poll.options.map((option, index) => (
                  <button
                    key={index}
                    className="poll-option-btn"
                    onClick={() => handleVote(poll.id, index)}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="poll-results">
                {poll.options.map((option, index) => {
                  const percentage = poll.totalVotes > 0 ? (poll.votes[index] / poll.totalVotes) * 100 : 0;
                  return (
                    <div key={index} className="poll-option">
                      <div className="option-info">
                        <span>{option}</span>
                        <span>{poll.votes[index]} votes ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Polls; 
import React, { useState } from 'react';
import './OnDuty.css';

const mockUser = { role: 'student', name: 'John Doe', dept: 'CSE' }; // Change role to 'admin' for admin view

const OnDuty = () => {
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({
    numStudents: 1,
    students: [{ name: '', dept: mockUser.dept }],
    noOfDays: 1,
    fromDate: '',
    toDate: '',
    org: '',
    poster: null,
    payment: null
  });
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedReq, setSelectedReq] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [role, setRole] = useState('student');

  const handleFormChange = (e, idx) => {
    const { name, value, files } = e.target;
    if (name === 'numStudents') {
      const n = Math.min(5, parseInt(value, 10));
      setForm(f => ({
        ...f,
        numStudents: n,
        students: Array.from({ length: n }, (_, i) => f.students[i] || { name: '', dept: mockUser.dept })
      }));
    } else if (name.startsWith('studentName')) {
      const i = parseInt(name.split('-')[1], 10);
      setForm(f => {
        const students = [...f.students];
        students[i].name = value;
        return { ...f, students };
      });
    } else if (name.startsWith('studentDept')) {
      const i = parseInt(name.split('-')[1], 10);
      setForm(f => {
        const students = [...f.students];
        students[i].dept = value;
        return { ...f, students };
      });
    } else if (name === 'poster' || name === 'payment') {
      setForm(f => ({ ...f, [name]: files[0] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    setRequests(r => [
      ...r,
      { ...form, status: 'pending', id: Date.now(), rejection: '' }
    ]);
    setForm({
      numStudents: 1,
      students: [{ name: '', dept: mockUser.dept }],
      noOfDays: 1,
      fromDate: '',
      toDate: '',
      org: '',
      poster: null,
      payment: null
    });
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  const handleApprove = id => {
    setRequests(r => r.map(req => req.id === id ? { ...req, status: 'approved' } : req));
  };
  const handleReject = id => {
    setRequests(r => r.map(req => req.id === id ? { ...req, status: 'rejected', rejection: rejectionReason } : req));
    setSelectedReq(null);
    setRejectionReason('');
  };

  return (
    <div className="on-duty-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>On-Duty Request</h2>
        <button className="btn btn-secondary" onClick={() => setRole(role === 'student' ? 'admin' : 'student')}>
          Switch to {role === 'student' ? 'Admin' : 'Student'} View
        </button>
      </div>
      {role === 'student' ? (
        <>
          <form className="od-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label>Number of Students
                <input type="number" name="numStudents" min={1} max={5} value={form.numStudents} onChange={handleFormChange} required />
              </label>
              <label>No. of Days
                <input type="number" name="noOfDays" min={1} max={5} value={form.noOfDays} onChange={handleFormChange} required />
              </label>
              <label>From Date
                <input type="date" name="fromDate" value={form.fromDate} onChange={handleFormChange} required />
              </label>
              <label>To Date
                <input type="date" name="toDate" value={form.toDate} onChange={handleFormChange} required />
              </label>
            </div>
            <div className="form-row">
              <label>Organization Name
                <input type="text" name="org" value={form.org} onChange={handleFormChange} required />
              </label>
              <label>Event Poster/Brochure
                <input type="file" name="poster" accept="image/*,application/pdf" onChange={handleFormChange} />
              </label>
              <label className="payment-label">Payment Details (optional)
                <input type="file" name="payment" accept="image/*,application/pdf" onChange={handleFormChange} />
              </label>
            </div>
            <div className="students-list">
              {form.students.map((s, i) => (
                <div className="student-fields" key={i}>
                  <label>Student Name
                    <input type="text" name={`studentName-${i}`} value={s.name} onChange={e => handleFormChange(e, i)} required className="wide-input" maxLength={30} />
                  </label>
                  <label>Dept
                    <input type="text" name={`studentDept-${i}`} value={s.dept} onChange={e => handleFormChange(e, i)} required className="wide-input" maxLength={30} />
                  </label>
                </div>
              ))}
            </div>
            <button type="submit">Submit OD Request</button>
          </form>
          {showPopup && (
            <div className="od-popup">OD Request Submitted!</div>
          )}
        </>
      ) : (
        <div className="od-admin-list">
          <h3>Pending OD Requests</h3>
          {requests.length === 0 && <p>No requests yet.</p>}
          {requests.map(req => (
            <div className={`od-request-card ${req.status}`} key={req.id}>
              <div><strong>Students:</strong> {req.students.map(s => s.name).join(', ')}</div>
              <div><strong>Dept:</strong> {req.students.map(s => s.dept).join(', ')}</div>
              <div><strong>No. of Days:</strong> {req.noOfDays}</div>
              <div><strong>Date:</strong> {req.date}</div>
              <div><strong>Day:</strong> {req.day}</div>
              <div><strong>Organization:</strong> {req.org}</div>
              <div><strong>Poster:</strong> {req.poster ? req.poster.name : 'N/A'}</div>
              <div><strong>Payment:</strong> {req.payment ? req.payment.name : 'N/A'}</div>
              <div><strong>Status:</strong> {req.status}</div>
              {req.status === 'pending' && (
                <div className="od-actions">
                  <button onClick={() => handleApprove(req.id)}>Accept</button>
                  <button onClick={() => setSelectedReq(req.id)}>Reject</button>
                </div>
              )}
              {req.status === 'rejected' && req.rejection && (
                <div className="od-rejection"><strong>Rejection Reason:</strong> {req.rejection}</div>
              )}
              {selectedReq === req.id && (
                <div className="od-reject-form">
                  <input type="text" placeholder="Reason for rejection" value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} />
                  <button onClick={() => handleReject(req.id)}>Submit</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OnDuty; 
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

const SUBMISSION_STATUS_KEY = 'spms_student_submission_done';

const SubmissionPage = () => {
  const [comment, setComment] = useState('');
  const [fileName, setFileName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setFileName(file ? file.name : '');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem(SUBMISSION_STATUS_KEY, 'true');
    setSubmitted(true);
    setComment('');
    setFileName('');
  };

  useEffect(() => {
    document.title = 'Submission | Student Project Management System';
  }, []);

  useEffect(() => {
    if (!submitted) return undefined;
    const timer = setTimeout(() => setSubmitted(false), 3500);
    return () => clearTimeout(timer);
  }, [submitted]);

  return (
    <div className="dashboard-main full-width-page">
      <Navbar title="Final Submission" />

      <section className="card submission-card">
        <h2>Submit Final Work</h2>
        <p>Upload your final project file and include a short summary.</p>

        <form onSubmit={handleSubmit} className="submission-form">
          <label htmlFor="fileUpload">Upload File</label>
          <input id="fileUpload" type="file" onChange={handleFileChange} />
          {fileName && <span className="file-preview">Selected: {fileName}</span>}

          <label htmlFor="comment">Comment</label>
          <textarea
            id="comment"
            rows={5}
            placeholder="Write your final submission notes"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>

        {submitted && <p className="success-text">Submission successful! (Frontend demo)</p>}
      </section>
    </div>
  );
};

export default SubmissionPage;

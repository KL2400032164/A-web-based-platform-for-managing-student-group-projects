import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { projectApi } from '../lib/api';

const SubmissionPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');

  const [comment, setComment] = useState('');
  const [fileName, setFileName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setFileName(file ? file.name : '');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!projectId) {
      setError('Missing project id. Open submission from a project card.');
      return;
    }

    try {
      await projectApi.submitFinalWork({
        projectId,
        studentId: user.id,
        comment,
        fileName
      });
      setSubmitted(true);
      setError('');
      setComment('');
      setFileName('');
    } catch (requestError) {
      setError(requestError.message);
    }
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

        {error && <p className="error-text">{error}</p>}
        {submitted && <p className="success-text">Submission successful.</p>}
      </section>
    </div>
  );
};

export default SubmissionPage;


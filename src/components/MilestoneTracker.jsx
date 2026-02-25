const MilestoneTracker = ({ milestones }) => {
  return (
    <section className="card milestone-card">
      <h3>Milestone Timeline</h3>
      <div className="timeline">
        {milestones.map((milestone, index) => (
          <div className="timeline-item" key={milestone.id}>
            <div className={`timeline-dot ${milestone.completion === 100 ? 'done' : ''}`}>{index + 1}</div>
            <div className="timeline-content">
              <h4>{milestone.label}</h4>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${milestone.completion}%` }} />
              </div>
              <span>{milestone.completion}% complete</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MilestoneTracker;

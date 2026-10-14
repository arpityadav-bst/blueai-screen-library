// BlueAI: Jobs Screen

/* V3, Phase 5: the job list (JobCard, its details dialog, the status badge and the sample jobs) never
   rendered, the tab is the empty state below, so it is deleted rather than restyled. */

/* The tab is the kit's EmptyState (.v2-empty). The 20-day progress moved to the partner dashboard
   (PM, 2026-10-14), so a set-up partner is told when the next run is and pointed at Earnings, where
   the 20 days show; before the worker is set up, the action goes to Chat, where the worker runs
   (review round 2, pass B, R19). The header is the kit's ScreenHeader. */
function JobsScreen({ isLoading, onGoChat }) {
  if (isLoading) return (
    <div className="v3-tabpage">
      <div className="v2-screen-header"><Shimmer h={26} w={120} r={6} /></div>
    </div>
  );

  const WF = window.WorkerFlow;
  return (
    <div className="v3-tabpage">
      <ScreenHead title="Jobs" />
      <div className="v3-screen-body">
        {WF.isOnboarded() ? (
          <div className="v2-empty v3-fill">
            <div className="v2-empty-icon"><IcoBriefcase size={24} /></div>
            <h2 className="v2-text-title-lg v2-empty-title">Your worker runs every day</h2>
            <p className="v2-text-body v2-empty-body">{WF.nextRunLine()}</p>
            <div className="v2-empty-actions">
              <a href={window.BlueAILinks.dashboard} target="_blank" rel="noopener" className="v2-button v2-button--secondary">
                See your 20 days on Earnings<window.V2Kit.Icon name="external" /><span className="v2-sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="v2-empty v3-fill">
            <div className="v2-empty-icon"><IcoBriefcase size={24} /></div>
            <h2 className="v2-text-title-lg v2-empty-title">No runs yet</h2>
            <p className="v2-text-body v2-empty-body">Run the BlueAI worker from Chat to start your 20 days.</p>
            <div className="v2-empty-actions"><button type="button" onClick={onGoChat} className="v2-button v2-button--primary">Go to Chat</button></div>
          </div>
        )}
      </div>
    </div>
  );
}

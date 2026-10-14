// BlueAI: Jobs Screen

/* V3, Phase 5: the job list (JobCard, its details dialog, the status badge and the sample jobs) never
   rendered, the tab is the empty state below, so it is deleted rather than restyled. */

/* Review round 1 (U13): the tab says where the partner's program stands instead of "Coming soon":
   today's run and the 20 days, the worker home's strip (worker_day_done.jsx EarningsStrip: the
   segments, the tick receipt, the Earnings link) read from the same state. Before the worker is set
   up, and in the plain option, which shows no numbers anywhere, it is the kit's EmptyState
   (.v2-empty) pointing at where the worker starts. The skeleton cards are the kit card, the header
   the kit's ScreenHeader and the bar the kit DayBar's rail (review round 2).
   Review round 2, pass B (R19, R4): the empty state's action goes to Chat, where the worker runs; a
   set-up partner in the plain option is told when the next run is, never "No runs yet"; a failed
   day's strip offers Retry. */
function JobsScreen({ isLoading, onGoChat, onRetry }) {
  if (isLoading) return (
    <div className="v3-tabpage">
      <div className="v2-screen-header"><Shimmer h={26} w={120} r={6} /></div>
      <div className="v3-screen-body">
        <div className="v2-card v3-progress">
          <div className="v2-daybar">
            <Shimmer h={16} w="40%" r={6} />
            <Shimmer h="var(--v2-rail)" />
            <Shimmer h={12} w="60%" r={5} />
          </div>
        </div>
      </div>
    </div>
  );

  const DD = window.WorkerDayDone;
  const WF = window.WorkerFlow;
  const back = WF.isOnboarded();
  return (
    <div className="v3-tabpage">
      <ScreenHead title="Jobs" />
      <div className="v3-screen-body">
        {back && DD.getStyle() !== 'plain' ? <DD.EarningsStrip onRetry={onRetry} /> : back ? (
          <div className="v2-empty v3-fill">
            <div className="v2-empty-icon"><IcoBriefcase size={24} /></div>
            <h2 className="v2-text-title-lg v2-empty-title">Your worker runs every day</h2>
            <p className="v2-text-body v2-empty-body">{WF.nextRunLine()}</p>
          </div>
        ) : (
          <div className="v2-empty v3-fill">
            <div className="v2-empty-icon"><IcoBriefcase size={24} /></div>
            <h2 className="v2-text-title-lg v2-empty-title">No runs yet</h2>
            <p className="v2-text-body v2-empty-body">Run the BlueAI worker from Chat. Today’s run and your 20 days show up here.</p>
            <div className="v2-empty-actions"><button type="button" onClick={onGoChat} className="v2-button v2-button--primary">Go to Chat</button></div>
          </div>
        )}
      </div>
    </div>
  );
}

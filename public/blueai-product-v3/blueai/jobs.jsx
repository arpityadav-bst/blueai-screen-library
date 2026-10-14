// BlueAI: Jobs Screen

/* V3, Phase 5: the job list (JobCard, its details dialog, the status badge and the sample jobs) never
   rendered, the tab is the empty state below, so it is deleted rather than restyled. */

/* V3 (phase 4; kit parts since review round 1): the tab is an empty state today, under the one
   screen header. The kit's EmptyState (.v2-empty) names what will appear on a sunken mark in the
   muted ink (no coloured circle, no illustration) and fills the band under the header, so it
   centres in what is left with no viewport height. The skeleton cards are the kit card. */
function JobsScreen({ isLoading }) {
  if (isLoading) return (
    <div className="v3-tabpage">
      <div className="v3-screen-head"><Shimmer h={26} w={120} r={6} /></div>
      <div className="v3-list">
        {[1, 2, 3].map(i => (
          <div key={i} className="v2-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <Shimmer h={16} w="62%" r={6} />
              <Shimmer h={22} w={52} r={999} />
            </div>
            <Shimmer h={12} w="90%" r={5} extra={{ marginBottom: 6 }} />
            <Shimmer h={12} w="72%" r={5} extra={{ marginBottom: 14 }} />
            <Shimmer h={22} w={72} r={4} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="v3-tabpage">
      <ScreenHead title="Jobs" />
      <div className="v2-empty v3-fill">
        <div className="v2-empty-icon"><IcoBriefcase size={24} /></div>
        <h2 className="v2-text-title-lg v2-empty-title">Coming Soon</h2>
        <p className="v2-text-body v2-empty-body">
          We are working on this section to bring you new opportunities. Check back soon for updates!
        </p>
      </div>
    </div>
  );
}

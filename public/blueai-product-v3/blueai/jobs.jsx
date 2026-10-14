// BlueAI: Jobs Screen

/* V3, Phase 5: the job list (JobCard, its details dialog, the status badge and the sample jobs) never
   rendered, the tab is the empty state below, so it is deleted rather than restyled. */

/* V3 (phase 4, worker.css): the tab is an empty state today. It names what will appear, on a
   sunken mark in the muted ink (no coloured circle, no illustration); the skeleton cards take the
   in-flow card (1px line, 16 radius, no cast). */
function JobsScreen({ isLoading }) {
  if (isLoading) return (
    <div className="v3-tab">
      <Shimmer h={26} w={120} r={6} extra={{ marginBottom: 20 }} />
      <div className="v3-list">
        {[1, 2, 3].map(i => (
          <div key={i} className="v3-skel">
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
    <div className="v3-empty v3-empty--page">
      <div className="v3-empty-mark"><IcoBriefcase size={24} stroke={1.75} /></div>
      <h2 className="v3-empty-title">Coming Soon</h2>
      <p className="v3-empty-text">
        We are working on this section to bring you new opportunities. Check back soon for updates!
      </p>
    </div>
  );
}

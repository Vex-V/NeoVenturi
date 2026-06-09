const GEOM = [
  {
    group: 'Motive Nozzle (C–D)',
    rows: [
      { param: 'Inlet / Throat / Exit Ø', value: '4.0 / 1.0 / 1.8 mm' },
      { param: 'Converging half-angle', value: '20°' },
      { param: 'Diverging half-angle', value: '6°' },
      { param: 'Conv. / Throat / Div. length', value: '4.1 / 0.5 / 3.8 mm' },
      { param: 'Total nozzle length', value: '8.4 mm' },
    ],
  },
  {
    group: 'Suction Chamber',
    rows: [
      { param: 'Diameter × Length', value: '8.0 × 8.0 mm' },
      { param: 'Nozzle projection into chamber', value: '2.0 mm' },
    ],
  },
  {
    group: 'Diffuser (C–D)',
    rows: [
      { param: 'Inlet / Throat / Outlet Ø', value: '8.0 / 3.0 / 6.0 mm' },
      { param: 'Outlet / Throat area ratio', value: '4 : 1' },
      { param: 'Converging half-angle', value: '15°' },
      { param: 'Diverging half-angle', value: '6°' },
      { param: 'Converging length', value: '9.3 mm' },
      { param: 'Diverging length', value: '14.3 mm' },
    ],
  },
  {
    group: 'Device Total',
    rows: [{ param: 'Overall length', value: '≈ 40 mm' }],
  },
];

const CFD_VARS = [
  {
    param: 'Nozzle throat Ø',
    levels: ['0.85 mm', '1.00 mm', '1.15 mm'],
    baseline: 1,
    note: 'Controls jet Mach number and primary mass flux',
  },
  {
    param: 'Diffuser throat Ø',
    levels: ['2.5 mm', '3.0 mm', '3.5 mm'],
    baseline: 1,
    note: 'Governs minimum area and downstream pressure recovery',
  },
  {
    param: 'Nozzle projection',
    levels: ['1 mm', '2 mm', '3 mm'],
    baseline: 1,
    note: 'Sets free-jet development length before converging walls',
  },
];

function Badge({ children }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 11px',
        borderRadius: 6,
        background: 'rgba(66,153,225,0.12)',
        border: '1px solid rgba(66,153,225,0.28)',
        color: '#90cdf4',
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: 0.3,
      }}
    >
      {children}
    </span>
  );
}

function Card({ title, children }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
      }}
    >
      <div
        style={{
          padding: '12px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          color: 'rgba(255,255,255,0.38)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 2.5,
          textTransform: 'uppercase',
        }}
      >
        {title}
      </div>
      <div style={{ padding: '16px 20px' }}>{children}</div>
    </div>
  );
}

export default function InfoPanel() {
  return (
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
        color: 'rgba(255,255,255,0.82)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      }}
    >
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '36px 28px 72px' }}>

        {/* Hero */}
        <div style={{ marginBottom: 36 }}>
          <h1
            style={{
              margin: '0 0 10px',
              fontSize: 22,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.92)',
              letterSpacing: -0.3,
            }}
          >
            Venturi Vacuum Generator
          </h1>
          <p
            style={{
              margin: '0 0 16px',
              fontSize: 14,
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.52)',
              maxWidth: 620,
            }}
          >
            Compressed-air single-stage air ejector. Generates vacuum from a 9 bar(g) supply
            using three inline elements: a primary C–D motive nozzle, a suction chamber, and a
            C–D diffuser. Designed for CFD baseline optimization.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Badge>9 bar(g) supply</Badge>
            <Badge>100 L/min FAD</Badge>
            <Badge>ṁ ≈ 1.96 g/s</Badge>
            <Badge>≈ 40 mm total length</Badge>
            <Badge>Axisymmetric</Badge>
          </div>
        </div>

        {/* Operating Principle */}
        <Card title="Operating Principle">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              {
                n: '1',
                title: 'Motive Nozzle (C–D)',
                body:
                  'Compressed air at 10 bar(a) expands through a 4 → 1 → 1.8 mm nozzle. The 1 mm throat is choked, producing a supersonic exit jet (Aₑ/Aₜ = 3.24). Half-angles: 20° converging, 6° diverging.',
              },
              {
                n: '2',
                title: 'Suction Chamber',
                body:
                  'The supersonic jet issues into an 8 mm diameter × 8 mm plenum. The nozzle projects 2 mm into the chamber, creating a short free-jet region that entrains ambient air through the suction port.',
              },
              {
                n: '3',
                title: 'Converging–Diverging Diffuser',
                body:
                  'Combined flow contracts through an 8 → 3 mm section (15°) then expands to a 6 mm outlet (6°). Static pressure is recovered toward atmospheric, sustaining sub-atmospheric pressure in the suction chamber.',
              },
            ].map(({ n, title, body }, i, arr) => (
              <div
                key={n}
                style={{
                  display: 'flex',
                  gap: 16,
                  paddingBottom: i < arr.length - 1 ? 16 : 0,
                  marginBottom: i < arr.length - 1 ? 16 : 0,
                  borderBottom:
                    i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'rgba(66,153,225,0.18)',
                    border: '1px solid rgba(66,153,225,0.35)',
                    color: '#7bbcff',
                    fontSize: 12,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 1,
                  }}
                >
                  {n}
                </span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 4 }}>
                    {title}
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.65, color: 'rgba(255,255,255,0.5)' }}>
                    {body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Geometry Table */}
        <Card title="Baseline Geometry">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <tbody>
              {GEOM.map(({ group, rows }) => (
                <>
                  <tr key={group}>
                    <td
                      colSpan={2}
                      style={{
                        padding: '8px 0 6px',
                        color: '#7bbcff',
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: 2,
                        textTransform: 'uppercase',
                        borderBottom: '1px solid rgba(66,153,225,0.2)',
                        paddingBottom: 6,
                      }}
                    >
                      {group}
                    </td>
                  </tr>
                  {rows.map(({ param, value }) => (
                    <tr key={param}>
                      <td
                        style={{
                          padding: '7px 0 7px 12px',
                          color: 'rgba(255,255,255,0.48)',
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          width: '60%',
                        }}
                      >
                        {param}
                      </td>
                      <td
                        style={{
                          padding: '7px 0',
                          fontFamily: 'monospace',
                          color: 'rgba(255,255,255,0.82)',
                          fontWeight: 500,
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          textAlign: 'right',
                        }}
                      >
                        {value}
                      </td>
                    </tr>
                  ))}
                  <tr key={`${group}-spacer`}>
                    <td colSpan={2} style={{ padding: '6px 0' }} />
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </Card>

        {/* CFD Variables */}
        <Card title="CFD Design Variables">
          <p style={{ margin: '0 0 16px', fontSize: 13, color: 'rgba(255,255,255,0.42)', lineHeight: 1.6 }}>
            Three parameters are varied in the design-of-experiments study. All other dimensions remain fixed at baseline values. Baseline level is highlighted.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {CFD_VARS.map(({ param, levels, baseline, note }) => (
              <div
                key={param}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '160px auto',
                  gap: '8px 16px',
                  alignItems: 'start',
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.78)', marginBottom: 2 }}>
                    {param}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.32)', lineHeight: 1.5 }}>
                    {note}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', paddingTop: 2 }}>
                  {levels.map((lvl, i) => (
                    <span
                      key={lvl}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontFamily: 'monospace',
                        fontWeight: i === baseline ? 700 : 400,
                        background:
                          i === baseline
                            ? 'rgba(66,153,225,0.18)'
                            : 'rgba(255,255,255,0.05)',
                        border:
                          i === baseline
                            ? '1px solid rgba(66,153,225,0.4)'
                            : '1px solid rgba(255,255,255,0.08)',
                        color: i === baseline ? '#90cdf4' : 'rgba(255,255,255,0.5)',
                      }}
                    >
                      {lvl}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
}

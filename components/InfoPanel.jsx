// V2 vs V3 geometry — structured to follow V3 sections.
// V2 fields with no V3 counterpart are omitted; V3-only sections show "—" for V2.
const GEOM = [
  {
    group: 'Motive Nozzle (C–D)',
    rows: [
      { param: 'Inlet / Throat / Exit Ø',      v2: '4.0 / 1.0 / 1.8 mm', v3: '4.0 / 1.0 / 1.8 mm' },
      { param: 'Converging half-angle',          v2: '20°',                 v3: '20°' },
      { param: 'Diverging half-angle',           v2: '6°',                  v3: '6°' },
      { param: 'Conv. / Throat / Div. length',  v2: '4.1 / 0.5 / 3.8 mm', v3: '4.1 / 0.5 / 3.8 mm' },
      { param: 'Total nozzle length',            v2: '8.4 mm',              v3: '8.4 mm' },
    ],
  },
  {
    group: 'Suction Chamber',
    rows: [
      { param: 'Diameter × Length',              v2: '8.0 × 8.0 mm',       v3: '8.0 × 10.0 mm' },
      { param: 'Nozzle projection',              v2: '2.0 mm',              v3: '2.0 mm' },
    ],
  },
  {
    group: 'Constant Area Mixing Section',
    rows: [
      { param: 'Diameter',                       v2: '—',                   v3: '4.0 mm' },
      { param: 'Length',                         v2: '—',                   v3: '15.0 mm' },
    ],
  },
  {
    group: 'Diffuser (Diverging)',
    rows: [
      { param: 'Inlet Ø / Outlet Ø',            v2: '—',                   v3: '4.0 / 7.0 mm' },
      { param: 'Half-angle',                     v2: '6°',                  v3: '6°' },
      { param: 'Length',                         v2: '—',                   v3: '17.0 mm' },
    ],
  },
  {
    group: 'Device Total',
    rows: [
      { param: 'Overall length',                 v2: '≈ 40 mm',             v3: '≈ 40 mm' },
    ],
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
          <h1 style={{ margin: '0 0 10px', fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,0.92)', letterSpacing: -0.3 }}>
            Venturi Vacuum Generator
          </h1>
          <p style={{ margin: '0 0 16px', fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.52)', maxWidth: 620 }}>
            Compressed-air single-stage air ejector. Generates vacuum from a 9 bar(g) supply
            using a primary C–D motive nozzle, suction chamber, constant-area mixing section,
            and diverging diffuser. Designed for CFD baseline optimization.
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
                body: 'Compressed air at 10 bar(a) expands through a 4 → 1 → 1.8 mm nozzle. The 1 mm throat is choked, producing a supersonic exit jet (Aₑ/Aₜ = 3.24). Half-angles: 20° converging, 6° diverging.',
              },
              {
                n: '2',
                title: 'Suction Chamber',
                body: 'The supersonic jet issues into an 8 mm diameter plenum. The nozzle projects 2 mm into the chamber, creating a free-jet region that entrains ambient air through the suction port.',
              },
              {
                n: '3',
                title: 'Constant Area Mixing Section',
                body: 'The primary jet and entrained secondary flow mix in a 4 mm constant-area duct over 15 mm. Momentum exchange equalises velocity and pressure across the combined stream before expansion.',
              },
              {
                n: '4',
                title: 'Diverging Diffuser',
                body: 'The mixed flow expands from 4 mm to 7 mm over 17 mm at a 6° half-angle, recovering static pressure toward atmospheric while sustaining sub-atmospheric pressure in the suction chamber.',
              },
            ].map(({ n, title, body }, i, arr) => (
              <div
                key={n}
                style={{
                  display: 'flex',
                  gap: 16,
                  paddingBottom: i < arr.length - 1 ? 16 : 0,
                  marginBottom: i < arr.length - 1 ? 16 : 0,
                  borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
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

        {/* Baseline Geometry — V2 vs V3 */}
        <Card title="Baseline Geometry">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ padding: '0 0 10px 0', textAlign: 'left', color: 'rgba(255,255,255,0.28)', fontSize: 11, fontWeight: 600, letterSpacing: 0.5, width: '50%' }}>
                  Parameter
                </th>
                <th style={{ padding: '0 0 10px 12px', textAlign: 'right', color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 700, letterSpacing: 1, width: '25%' }}>
                  V2
                </th>
                <th style={{ padding: '0 0 10px 12px', textAlign: 'right', color: '#7bbcff', fontSize: 11, fontWeight: 700, letterSpacing: 1, width: '25%' }}>
                  V3
                </th>
              </tr>
            </thead>
            <tbody>
              {GEOM.map(({ group, rows }) => (
                <>
                  <tr key={group}>
                    <td
                      colSpan={3}
                      style={{
                        padding: '10px 0 6px',
                        color: '#7bbcff',
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: 2,
                        textTransform: 'uppercase',
                        borderBottom: '1px solid rgba(66,153,225,0.2)',
                      }}
                    >
                      {group}
                    </td>
                  </tr>
                  {rows.map(({ param, v2, v3 }) => {
                    const changed = v2 !== v3 && v2 !== '—';
                    return (
                      <tr key={param}>
                        <td style={{ padding: '7px 0 7px 0', color: 'rgba(255,255,255,0.45)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          {param}
                        </td>
                        <td
                          style={{
                            padding: '7px 0 7px 12px',
                            fontFamily: 'monospace',
                            textAlign: 'right',
                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                            color: v2 === '—'
                              ? 'rgba(255,255,255,0.18)'
                              : changed
                              ? 'rgba(255,200,100,0.7)'
                              : 'rgba(255,255,255,0.5)',
                            textDecoration: changed ? 'line-through' : 'none',
                          }}
                        >
                          {v2}
                        </td>
                        <td
                          style={{
                            padding: '7px 0 7px 12px',
                            fontFamily: 'monospace',
                            fontWeight: 600,
                            textAlign: 'right',
                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                            color: v2 === '—' ? '#7bbcff' : changed ? '#90cdf4' : 'rgba(255,255,255,0.78)',
                          }}
                        >
                          {v3}
                        </td>
                      </tr>
                    );
                  })}
                  <tr key={`${group}-spacer`}>
                    <td colSpan={3} style={{ padding: '5px 0' }} />
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
                style={{ display: 'grid', gridTemplateColumns: '160px auto', gap: '8px 16px', alignItems: 'start' }}
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
                        background: i === baseline ? 'rgba(66,153,225,0.18)' : 'rgba(255,255,255,0.05)',
                        border: i === baseline ? '1px solid rgba(66,153,225,0.4)' : '1px solid rgba(255,255,255,0.08)',
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

        {/* CFD Simulation Video */}
        <Card title="CFD Simulation">
          <video
            controls
            style={{
              width: '100%',
              borderRadius: 8,
              background: '#000',
              display: 'block',
            }}
          >
            <source src="/Simulation.mp4" type="video/mp4" />
          </video>
        </Card>

      </div>
    </div>
  );
}

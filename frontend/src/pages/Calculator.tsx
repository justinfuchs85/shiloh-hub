import { useState, useEffect } from 'react'

function calcPI(principal: number, annualRate: number, termYears: number): number {
  if (annualRate === 0) return principal / (termYears * 12)
  const r = annualRate / 100 / 12
  const n = termYears * 12
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

function fmt(n: number) {
  return '$' + Math.round(n).toLocaleString()
}

const RATES = [6.0, 6.25, 6.5, 6.75, 7.0, 7.25]

export default function Calculator() {
  const [price, setPrice] = useState(500000)
  const [downAmt, setDownAmt] = useState(100000)
  const [rate, setRate] = useState(6.5)
  const [term, setTerm] = useState(30)
  const [tax, setTax] = useState(7075)
  const [insurance, setInsurance] = useState(1874)
  const [closing, setClosing] = useState(15000)
  const [pmiRate, setPmiRate] = useState(0.5)
  const [showAmort, setShowAmort] = useState(false)

  const downPct = price > 0 ? (downAmt / price) * 100 : 0
  const principal = price - downAmt
  const pi = calcPI(principal, rate, term)
  const taxMo = tax / 12
  const insMo = insurance / 12
  const ltv = downPct
  const pmiMo = ltv < 20 ? (principal * pmiRate / 100) / 12 : 0
  const total = pi + taxMo + insMo + pmiMo
  const totalPaid = pi * term * 12
  const totalInterest = totalPaid - principal
  const payoffYear = new Date().getFullYear() + term
  const cashAtClosing = downAmt + closing - 10015 // $10,015 EMD credit

  // Amortization table (yearly)
  const amortRows: { year: number; principalPaid: number; interestPaid: number; balance: number }[] = []
  if (showAmort && principal > 0) {
    const r = rate / 100 / 12
    let balance = principal
    for (let yr = 1; yr <= term; yr++) {
      let yPrincipal = 0, yInterest = 0
      for (let mo = 0; mo < 12; mo++) {
        const intPay = balance * r
        const prinPay = pi - intPay
        yInterest += intPay
        yPrincipal += prinPay
        balance -= prinPay
        if (balance < 0) balance = 0
      }
      amortRows.push({ year: new Date().getFullYear() + yr, principalPaid: yPrincipal, interestPaid: yInterest, balance: Math.max(0, balance) })
      if (balance <= 0) break
    }
  }

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Inputs */}
        <div>
          <div className="section-title" style={{ marginTop: 0 }}>Loan inputs</div>
          <div className="card card-p" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            <div>
              <label className="field-label">Home price</label>
              <div className="calc-input-wrap"><span className="calc-prefix">$</span>
                <input type="number" className="calc-input" value={price} onChange={e => setPrice(Number(e.target.value))} />
              </div>
            </div>

            <div>
              <label className="field-label">Down payment</label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div className="calc-input-wrap" style={{ flex: 1 }}><span className="calc-prefix">$</span>
                  <input type="number" className="calc-input" value={downAmt} onChange={e => { setDownAmt(Number(e.target.value)) }} />
                </div>
                <div className="calc-input-wrap" style={{ width: 80 }}>
                  <input type="number" className="calc-input" step="0.5" value={parseFloat(downPct.toFixed(1))} onChange={e => setDownAmt(Math.round(price * Number(e.target.value) / 100))} />
                  <span className="calc-suffix">%</span>
                </div>
              </div>
              <div style={{ fontSize: 11, color: 'var(--teal)', marginTop: 4 }}>LTV: {(100 - downPct).toFixed(1)}%{ltv < 20 ? ' — PMI applies' : ' — No PMI'}</div>
            </div>

            <div>
              <label className="field-label">Loan amount</label>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 400, color: 'var(--teal-dark)', padding: '6px 0' }}>
                {fmt(principal)}
              </div>
            </div>

            <div>
              <label className="field-label">Interest rate</label>
              <div className="calc-input-wrap" style={{ width: 120 }}>
                <input type="number" className="calc-input" step="0.125" value={rate} onChange={e => setRate(Number(e.target.value))} />
                <span className="calc-suffix">%</span>
              </div>
            </div>

            <div>
              <label className="field-label">Loan term</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[30, 20, 15].map(t => (
                  <button key={t} className={`calc-term-btn${term === t ? ' active' : ''}`} onClick={() => setTerm(t)}>{t} yr</button>
                ))}
              </div>
            </div>

            <div>
              <label className="field-label">Property tax / yr</label>
              <div className="calc-input-wrap"><span className="calc-prefix">$</span>
                <input type="number" className="calc-input" value={tax} onChange={e => setTax(Number(e.target.value))} />
              </div>
            </div>

            <div>
              <label className="field-label">Home insurance / yr</label>
              <div className="calc-input-wrap"><span className="calc-prefix">$</span>
                <input type="number" className="calc-input" value={insurance} onChange={e => setInsurance(Number(e.target.value))} />
              </div>
            </div>

            <div>
              <label className="field-label">Closing costs (est.)</label>
              <div className="calc-input-wrap"><span className="calc-prefix">$</span>
                <input type="number" className="calc-input" value={closing} onChange={e => setClosing(Number(e.target.value))} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--warm-muted)', marginTop: 4 }}>Not included in monthly payment — cash needed at closing</div>
            </div>

            <div>
              <label className="field-label">PMI rate (if &lt; 20% down)</label>
              <div className="calc-input-wrap" style={{ width: 120 }}>
                <input type="number" className="calc-input" step="0.05" value={pmiRate} onChange={e => setPmiRate(Number(e.target.value))} />
                <span className="calc-suffix">%</span>
              </div>
            </div>

          </div>
        </div>

        {/* Results */}
        <div>
          <div className="section-title" style={{ marginTop: 0 }}>Monthly payment</div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ background: 'var(--teal-dark)', padding: '1.5rem 1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Total monthly</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 42, fontWeight: 300, color: '#fff', lineHeight: 1 }}>{fmt(total)}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>principal + interest + tax + insurance</div>
            </div>

            <div style={{ padding: '1rem 1.25rem' }}>
              <div className="calc-result-row"><span>Principal &amp; interest</span><span>{fmt(pi)}</span></div>
              <div className="calc-result-row"><span>Property tax</span><span>{fmt(taxMo)}</span></div>
              <div className="calc-result-row"><span>Home insurance</span><span>{fmt(insMo)}</span></div>
              {pmiMo > 0 && <div className="calc-result-row"><span>PMI</span><span>{fmt(pmiMo)}</span></div>}
            </div>

            <div style={{ padding: '0 1.25rem 1.25rem' }}>
              <div className="section-title">Loan summary</div>
              <div className="calc-result-row"><span>Total paid over life</span><span>{fmt(totalPaid)}</span></div>
              <div className="calc-result-row"><span>Total interest paid</span><span style={{ color: 'var(--text-warning)' }}>{fmt(totalInterest)}</span></div>
              <div className="calc-result-row"><span>Payoff date</span><span>{payoffYear}</span></div>
              <div className="calc-result-row" style={{ borderTop: '1px solid var(--border-3)', marginTop: 8, paddingTop: 8 }}>
                <span style={{ fontWeight: 500 }}>Cash needed at closing <span style={{ fontSize: 10, fontWeight: 400, color: 'var(--warm-muted)' }}>(−$10,015 EMD credit)</span></span>
                <span style={{ fontWeight: 500, color: 'var(--teal-dark)' }}>{fmt(cashAtClosing)}</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <button
              style={{ width: '100%', padding: 10, background: 'var(--bg-primary)', border: '1px solid var(--border-3)', borderRadius: 'var(--r-md)', fontSize: 12, fontFamily: 'var(--font-sans)', cursor: 'pointer', color: 'var(--teal)', letterSpacing: '0.04em' }}
              onClick={() => setShowAmort(v => !v)}
            >
              {showAmort ? 'Hide' : 'Show'} amortization schedule {showAmort ? '▴' : '▾'}
            </button>
          </div>

          {showAmort && (
            <div style={{ marginTop: 8, background: 'var(--bg-primary)', border: '1px solid var(--border-3)', borderRadius: 'var(--r-md)', overflow: 'hidden', maxHeight: 320, overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead style={{ background: 'var(--teal-dark)', color: '#fff', position: 'sticky', top: 0 }}>
                  <tr>
                    {['Year', 'Principal', 'Interest', 'Balance'].map(h => (
                      <th key={h} style={{ padding: '8px 10px', textAlign: h === 'Year' ? 'left' : 'right', fontWeight: 500, letterSpacing: '0.04em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {amortRows.map((row, i) => (
                    <tr key={row.year} style={{ background: i % 2 ? 'var(--bg-secondary)' : 'var(--bg-primary)' }}>
                      <td style={{ padding: '6px 10px' }}>{row.year}</td>
                      <td style={{ padding: '6px 10px', textAlign: 'right' }}>{fmt(row.principalPaid)}</td>
                      <td style={{ padding: '6px 10px', textAlign: 'right', color: 'var(--text-warning)' }}>{fmt(row.interestPaid)}</td>
                      <td style={{ padding: '6px 10px', textAlign: 'right' }}>{fmt(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Rate comparison */}
      <div style={{ marginTop: '1.5rem' }}>
        <div className="section-title">Rate comparison (30 yr, {fmt(principal)} loan)</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {RATES.map(r => {
            const p = calcPI(principal, r, 30)
            const mo = p + taxMo + insMo
            const isActive = r === rate
            return (
              <div key={r} onClick={() => setRate(r)} style={{ background: isActive ? 'var(--teal-dark)' : 'var(--bg-primary)', border: `1px solid ${isActive ? 'var(--teal-dark)' : 'var(--border-3)'}`, borderRadius: 'var(--r-md)', padding: '10px 12px', cursor: 'pointer', transition: 'all 0.15s' }}>
                <div style={{ fontSize: 10, color: isActive ? 'rgba(255,255,255,0.6)' : 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{r}%</div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 400, color: isActive ? '#fff' : 'var(--warm-dark)' }}>{fmt(p)}<span style={{ fontSize: 11, fontFamily: 'var(--font-sans)', opacity: 0.6 }}>/mo P&I</span></div>
                <div style={{ fontSize: 11, color: isActive ? 'rgba(255,255,255,0.5)' : 'var(--text-tertiary)', marginTop: 2 }}>Total: {fmt(mo)}/mo</div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

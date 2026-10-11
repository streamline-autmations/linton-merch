import { useId } from 'react'
import type { Product } from '@/data/products'

// Original, intentionally illustrative vector placeholders, never represented as product photographs.
export function ProductArtwork({
  product,
  className = '',
}: {
  product: Product
  className?: string
}) {
  const shadowId = useId().replace(/:/g, '')
  const c = product.colour
  let shape
  switch (product.art) {
    case 'polo':
    case 'tee':
      shape = (
        <>
          <path
            d="M116 79l40-19q24 13 48 0l40 19 41 62-44 28-17-24v128h-88V145l-17 24-44-28z"
            fill={c}
          />
          <path d="M156 60q24 18 48 0l-9 27h-29z" fill="#ffffff" opacity=".4" />
          {product.art === 'polo' && (
            <>
              <path
                d="M156 60l-6 27 22 10 8-21 8 21 22-10-6-27"
                fill={c}
                stroke="#212522"
                strokeOpacity=".15"
              />
              <path d="M180 76v35" stroke="#212522" strokeOpacity=".35" />
              <circle cx="180" cy="91" r="1.7" fill="#212522" />
              <circle cx="180" cy="103" r="1.7" fill="#212522" />
            </>
          )}
          <path
            d="M142 267h76M90 139l26 18m128 0 26-18"
            stroke="#212522"
            strokeOpacity=".15"
            fill="none"
          />
        </>
      )
      break
    case 'jacket':
      shape = (
        <>
          <path
            d="M145 69l22-12h26l22 12 23 11 31 65 14 108-39 7-22-107v123h-84V153l-22 107-39-7 14-108 31-65z"
            fill={c}
          />
          <path
            d="M167 57l-11 23 24 22 24-22-11-23M180 99v172"
            fill="none"
            stroke="#eee"
            strokeOpacity=".5"
            strokeWidth="2"
          />
          <path d="M145 183h23v30h-23zm47 0h23v30h-23z" fill="#000" opacity=".12" />
          <path d="M167 57v24h26V57" fill="#111" opacity=".15" />
        </>
      )
      break
    case 'vest':
      shape = (
        <>
          <path d="M139 71l30-12h22l30 12-3 51 21 28v121H121V150l21-28z" fill={c} />
          <path
            d="M169 59l11 63 11-63M180 122v149"
            fill="none"
            stroke="#212522"
            strokeOpacity=".3"
          />
          <path d="M127 183h106v14H127zm0 44h106v14H127z" fill="#eee" />
          <path d="M147 81v100h13V76m40 0v105h13V81" fill="#eee" />
        </>
      )
      break
    case 'cap':
      shape = (
        <>
          <path d="M100 191q-6-109 80-109 85 0 89 109z" fill={c} />
          <path d="M96 188q60-18 175 0l36 27q-86 44-170 15z" fill={c} />
          <path
            d="M180 82q-31 29-31 104m31-104q32 25 37 105M105 176q70-17 153 0"
            fill="none"
            stroke="#212522"
            strokeOpacity=".2"
          />
          <ellipse cx="180" cy="83" rx="7" ry="4" fill={c} />
        </>
      )
      break
    case 'bottle':
      shape = (
        <>
          <rect x="157" y="48" width="46" height="28" rx="5" fill="#292e2a" />
          <path d="M155 81q-19 14-19 31v147q0 22 44 22t44-22V112q0-17-19-31z" fill={c} />
          <path d="M148 116v138" stroke="white" strokeOpacity=".16" strokeWidth="5" />
          <path d="M141 267q39 13 78 0" stroke="#111" strokeOpacity=".2" fill="none" />
        </>
      )
      break
    case 'tote':
      shape = (
        <>
          <path d="M146 117V92q0-46 34-46t34 46v25" fill="none" stroke={c} strokeWidth="12" />
          <path d="M112 109h136l12 162H100z" fill={c} />
          <path d="M119 121l-9 140h140l-9-140" fill="none" stroke="#212522" strokeOpacity=".15" />
          <path d="M140 109v19m80-19v19" stroke="#212522" strokeOpacity=".2" strokeWidth="3" />
        </>
      )
      break
    case 'notebook':
      shape = (
        <>
          <path d="M121 68h129v208H121q-15 0-15-15V83q0-15 15-15" fill={c} />
          <path d="M119 69v206" stroke="#212522" strokeOpacity=".3" strokeWidth="3" />
          <path d="M233 68v210" stroke="#212522" strokeOpacity=".5" strokeWidth="6" />
          <path d="M128 277h122" stroke="#f4f1e6" strokeWidth="4" />
          <path d="M198 275v18l8-5 8 5v-18" fill="#d2bf74" />
        </>
      )
      break
    case 'mug':
      shape = (
        <>
          <path d="M225 132h25q36 0 36 39t-36 39h-25" fill="none" stroke={c} strokeWidth="19" />
          <path d="M113 112h115v120q0 27-58 27t-57-27z" fill={c} />
          <ellipse cx="170" cy="112" rx="58" ry="12" fill={c} />
          <ellipse cx="170" cy="112" rx="48" ry="8" fill="#212522" opacity=".2" />
          <path d="M124 134v87" stroke="#fff" strokeOpacity=".25" strokeWidth="5" />
        </>
      )
      break
    default:
      shape = (
        <>
          <path d="M87 114l87-30 101 35-86 35z" fill={c} />
          <path d="M87 114v119l102 38V154z" fill={c} />
          <path d="M189 154l86-35v120l-86 32z" fill={c} style={{ filter: 'brightness(.85)' }} />
          <path d="M125 101l106 36v119l-31 12V149L99 109z" fill="#434b3f" />
          <path
            d="M136 114q-63-62-31-73 34-12 76 84 57-99 85-76 26 24-66 86"
            fill="none"
            stroke="#434b3f"
            strokeWidth="9"
          />
        </>
      )
  }
  return (
    <svg className={`product-art ${className}`} aria-hidden="true" viewBox="0 0 360 330">
      <defs>
        <filter id={`shadow-${shadowId}`} x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="10" stdDeviation="9" floodOpacity=".13" />
        </filter>
      </defs>
      <ellipse cx="180" cy="284" rx="76" ry="9" fill="#212522" opacity=".04" />
      <g filter={`url(#shadow-${shadowId})`}>{shape}</g>
    </svg>
  )
}
